import type { PropsWithChildren, ReactNode } from 'react';
import { ErrorText, Field, HelpText, Label, LabelLine } from './styles';

type FormFieldProps = PropsWithChildren<{
  label: string;
  htmlFor?: string;
  help?: string;
  error?: string;
  action?: ReactNode;
}>;

export function FormField({ label, htmlFor, help, error, action, children }: FormFieldProps) {
  return (
    <Field>
      <LabelLine>
        <Label htmlFor={htmlFor}>{label}</Label>
        {action}
      </LabelLine>
      {children}
      {error ? <ErrorText role="alert">{error}</ErrorText> : help ? <HelpText>{help}</HelpText> : null}
    </Field>
  );
}
