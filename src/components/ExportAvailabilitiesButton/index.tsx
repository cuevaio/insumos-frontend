import { useDate, useMarket, useUnit } from '@/contexts/AppContext';
import { useMutation } from '@tanstack/react-query';
import ExcelJS from 'exceljs';
import FileSaver from 'file-saver';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

import { useAvailabilities } from '@/hooks/useAvailabilities';
import { useInsumos } from '@/hooks/useInsumos';

import { populateAvailabilityData, setupWorksheet } from '@/lib/export';

const ExportAvailabilitiesButton = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const { value: unit } = useUnit();
  const { value: date } = useDate();
  const { value: market } = useMarket();

  const { data } = useAvailabilities({
    unitId: unit?.id,
    unitName: unit?.name?.toString(),
    date: date?.toString(),
    market,
  });
  const availabilities = data?.availabilities;

  const { data: insumos } = useInsumos({
    date: date?.toString(),
    unit: unit,
    market,
  });

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!date) throw new Error('Select a date first!');
      if (!unit) throw new Error('Select a unit first!');
      if (!availabilities) throw new Error('No availabilities found');
      if (!insumos) throw new Error('No insumos found');

      const duration = data?.dayDurations[date.toString()];

      const response = await fetch(`/cpp-ui/template-${duration}.xlsx`);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = new ExcelJS.Workbook();

      await workbook.xlsx.load(arrayBuffer);

      const templateWorksheet = workbook.getWorksheet(1);
      if (!templateWorksheet) throw new Error('No template found');

      const worksheet = setupWorksheet(
        templateWorksheet,
        date.toString(),
        unit,
      );

      availabilities.forEach((availability, index) => {
        const insumo = insumos.insumos[index];

        populateAvailabilityData(
          worksheet,
          availability,
          index,
          insumo || undefined,
          unit,
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
      className="h-6 text-xs"
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
