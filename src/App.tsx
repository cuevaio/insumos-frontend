import React from 'react';

import { useTranslation } from 'react-i18next';

import AvailabilitiesFooter from '@/components/AvailabilitiesFooter';
import AvailabilitiesForm from '@/components/AvailabilitiesForm';
import AvailabilitiesHeader from '@/components/AvailabilitiesHeader';
import AvailabilitiesTable from '@/components/AvailabilitiesTable';

function App() {
  const {
    i18n: { language, changeLanguage },
  } = useTranslation();

  const formRef = React.useRef<HTMLFormElement | null>(null);

  // TODO: defaultLanguage will be get from backend
  const defaultLanguage = 'es';

  React.useEffect(() => {
    const userHasDifferentLanguage =
      defaultLanguage && defaultLanguage !== language;
    if (userHasDifferentLanguage) changeLanguage(defaultLanguage);
  }, [defaultLanguage, language, changeLanguage]);

  return (
    <div className="container mx-auto flex w-full flex-col flex-wrap gap-2">
      <AvailabilitiesHeader />
      <AvailabilitiesForm formRef={formRef}>
        <AvailabilitiesTable />
        <AvailabilitiesFooter formRef={formRef} />
      </AvailabilitiesForm>
    </div>
  );
}

export default App;
