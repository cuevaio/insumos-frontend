import { FC, FormEvent, MutableRefObject, ReactNode } from 'react';

interface AvailabilitiesFormProps {
  formRef: MutableRefObject<HTMLFormElement | null>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

const AvailabilitiesForm: FC<AvailabilitiesFormProps> = ({
  formRef,
  onSubmit,
  children,
}) => {
  return (
    <form className="w-full" ref={formRef} onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export default AvailabilitiesForm;
