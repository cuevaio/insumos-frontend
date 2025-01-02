import { useAvailabilities } from '@/hooks/useAvailabilities';
import { useFuelTypes } from '@/hooks/useFuelTypes';
import { useStore } from '@/hooks/useStore';
import { useUnits } from '@/hooks/useUnits';
import { useMutation } from '@tanstack/react-query';
import ExcelJS from 'exceljs';
import FileSaver from 'file-saver';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

import { populateAvailabilityData, setupWorksheet } from '@/lib/export';

const ExportAvailabilitiesButton = () => {
  const {
    // t,
    i18n: { language },
  } = useTranslation();

  // TODO: get from localStorage
  //   const {
  //     availabilityUnitId: unitId,
  //     availabilityDate: date,
  //     availabilityMarket: market,
  //   } = useStore();

  const unitId = localStorage.getItem('unit_id');
  const date = localStorage.getItem('date');
  const market = localStorage.getItem('market');

  console.log('unitId: ', unitId);
  console.log('date: ', date);
  console.log('market: ', market);

  const { data: units } = useUnits();
  const { data: fuelTypes } = useFuelTypes();

  // console.log('units: ', units)
  // console.log('fuelTypes: ', fuelTypes)

  const { data } = useAvailabilities({ unitId, date, market });
  const availabilities = data?.availabilities;

  const unit = units?.find((u) => u.id === unitId);

  // console.log('unit: ', unit)

  const fuelType1 =
    unit?.fuelType1ID && fuelTypes?.find((f) => f.id === unit.fuelType1ID);
  const fuelType2 =
    unit?.fuelType2ID && fuelTypes?.find((f) => f.id === unit.fuelType2ID);

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!date) throw new Error('Select a date first!');
      if (!unit) throw new Error('Select a unit first!');
      if (!fuelType1) throw new Error('Fuel type 1 not found');
      if (!availabilities) throw new Error('No availabilities found');

      const duration = data?.dayDurations[date]!;

      const response = await fetch(`/cpp-ui/template-${duration}.xlsx`);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      const templateWorksheet = workbook.getWorksheet(1);
      if (!templateWorksheet) throw new Error('No template found');

      const worksheet = setupWorksheet(
        workbook,
        templateWorksheet,
        date,
        unit,
        fuelType1,
        fuelType2 || undefined,
      );

      availabilities.forEach((availability, index) => {
        populateAvailabilityData(
          worksheet,
          availability,
          index,
          fuelType2 || undefined,
        );
      });

      workbook.removeWorksheet(1);

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      FileSaver.saveAs(
        blob,
        `RBII-Disponibilidad-${date}-${unit.name.split(' ').join('-')}-${market}-${language.startsWith('es') ? 'ES' : 'EN'}.xlsx`,
      );
    },
  });

  return (
    <Button
      variant="outline"
      onClick={() => {
        mutate();
      }}
    >
      Export
    </Button>
  );
};

export default ExportAvailabilitiesButton;
