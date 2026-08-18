import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseProps = {
  label: string;
  hint?: string;
  error?: string;
};

export function FormField({
  label,
  hint,
  error,
  ...props
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="creco-form-group">
      <label className="creco-form-label" htmlFor={props.id}>
        {label}
      </label>
      <input className="creco-input" {...props} />
      {hint && !error && <p className="creco-form-hint">{hint}</p>}
      {error && <p className="creco-form-error">{error}</p>}
    </div>
  );
}

export function FormSelect({
  label,
  hint,
  error,
  children,
  ...props
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="creco-form-group">
      <label className="creco-form-label" htmlFor={props.id}>
        {label}
      </label>
      <select className="creco-input creco-select" {...props}>
        {children}
      </select>
      {hint && !error && <p className="creco-form-hint">{hint}</p>}
      {error && <p className="creco-form-error">{error}</p>}
    </div>
  );
}

export function FormTextarea({
  label,
  hint,
  error,
  ...props
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="creco-form-group">
      <label className="creco-form-label" htmlFor={props.id}>
        {label}
      </label>
      <textarea className="creco-input creco-textarea" {...props} />
      {hint && !error && <p className="creco-form-hint">{hint}</p>}
      {error && <p className="creco-form-error">{error}</p>}
    </div>
  );
}
