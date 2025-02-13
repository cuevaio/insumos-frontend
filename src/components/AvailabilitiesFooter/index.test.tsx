import { MutableRefObject } from 'react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as AppContext from '@/contexts/AppContext';
import AvailabilitiesFooter from '@/components/AvailabilitiesFooter';
import i18n from '@/lib/i18n/i18n';
import { Unit } from '@/hooks/useUnits';

const queryClient = new QueryClient();

const MOCK_UNIT = {
  id: '01930e48-70fe-0e9a-1c18-bff758c72abe',
  name: 'unit1',
  createdBy: 'test',
  modifiedBy: 'test',
  modifiedOn: '2021-01-01',
  includeCil: true,
  includeLie: true,
  ippId: '1',
  ipp: {
    id: '1',
    createdBy: 'test',
    modifiedBy: 'test',
    modifiedOn: '2021-01-01',
    name: 'gas',
  },
  timeZone: 'America/New_York',
  fuelType1: {
    id: '1',
    createdBy: 'test',
    modifiedBy: 'test',
    modifiedOn: '2021-01-01',
    name: 'gas',
  },
  fuelType2: {
    id: '2',
    createdBy: 'test',
    modifiedBy: 'test',
    modifiedOn: '2021-01-01',
    name: 'diesel',
  },
  fuelType1ID: '1',
  fuelType2ID: '2',
} as Unit;

describe('AvailabilitiesFooter', () => {
  const mockFormRef: MutableRefObject<HTMLFormElement> = {
    current: {
      requestSubmit: vi.fn(),
      submit: vi.fn(),
      checkValidity: vi.fn(),
      reportValidity: vi.fn(),
      reset: vi.fn(),
    } as unknown as HTMLFormElement,
  };

  beforeEach(() => {
    vi.spyOn(AppContext, 'useDate').mockReturnValue({
      value: null,
      setValue: vi.fn(),
      dateDiff: 1,
    });

    vi.spyOn(AppContext, 'useUnit').mockReturnValue({
      value: MOCK_UNIT,
      setId: vi.fn(),
    });
  });

  const customRender = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <AppContext.AppProvider>
            <AvailabilitiesFooter formRef={mockFormRef} />
          </AppContext.AppProvider>
        </I18nextProvider>
      </QueryClientProvider>
    );
  };

  it('renders the correct text and elements', () => {
    customRender();

    expect(screen.getByText('Todas las fechas se muestran el el timezone America/New_York')).toBeInTheDocument();
    expect(screen.getByText('Promedio de precios de los últimos 30 días')).toBeInTheDocument();
    expect(screen.getByText('Tarifa de Transmisión')).toBeInTheDocument();
    expect(screen.getByText('Tarifa de Operación')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Exportar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Guardar cambios/i })).toBeInTheDocument();
  });

  it('applies disabled styles to the "Guardar cambios" button when dateDiff < 0', () => {
    vi.spyOn(AppContext, 'useDate').mockReturnValue({
      value: null,
      setValue: vi.fn(),
      dateDiff: -1,
    });

    customRender();

    const saveButton = screen.getByRole('button', { name: /Guardar cambios/i });
    expect(saveButton).toHaveClass('cursor-not-allowed opacity-50');
  });

  it('calls formRef.requestSubmit when "Guardar cambios" is clicked', async () => {
    customRender();
    const saveButton = screen.getByRole('button', { name: /Guardar cambios/i });

    await userEvent.click(saveButton);

    expect(mockFormRef.current.requestSubmit).toHaveBeenCalled();
  });
});
