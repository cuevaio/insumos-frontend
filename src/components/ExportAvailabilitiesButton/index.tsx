import { useMutation } from '@tanstack/react-query';
import ExcelJS from 'exceljs';
import FileSaver from 'file-saver';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

import { useAvailabilities } from '@/hooks/useAvailabilities';
import { useFuelTypes } from '@/hooks/useFuelTypes';
import { useInsumos } from '@/hooks/useInsumos';
import { useUnits } from '@/hooks/useUnits';

import { populateAvailabilityData, setupWorksheet } from '@/lib/export';
import { Market } from '@/lib/types';

const ExportAvailabilitiesButton = () => {
  const { t, i18n: { language } } = useTranslation();

  const unitId = localStorage.getItem('unit_id');
  const date = localStorage.getItem('date');
  const market = localStorage.getItem('market') as Market;

  const { data: units } = useUnits();
  const { data: fuelTypes } = useFuelTypes();
  const { data: insumos } = useInsumos({
    date: date?.toString(),
    unitId: unitId?.toString(),
    market,
  });

  const { data } = useAvailabilities({ unitId, date, market });
  const availabilities = data?.availabilities;

  const unit = units?.find((u) => u.id === unitId);

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
      if (!insumos) throw new Error('No insumos found');

      const duration = data?.dayDurations[date];

      const response = await fetch(`/cpp-ui/template-${duration}.xlsx`);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = new ExcelJS.Workbook();

      await workbook.xlsx.load(arrayBuffer);

      const templateWorksheet = workbook.getWorksheet(1);
      if (!templateWorksheet) throw new Error('No template found');

      const worksheet = setupWorksheet(
        templateWorksheet,
        date,
        unit,
        fuelType1,
        fuelType2 || undefined,
      );

      availabilities.forEach((availability, index) => {
        const insumo = insumos.insumos[index];

        populateAvailabilityData(
          worksheet,
          availability,
          index,
          insumo || undefined,
          fuelType2 || undefined,
        );
      });

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
      {t('Export')}
    </Button>
  );
};

export default ExportAvailabilitiesButton;
