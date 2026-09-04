import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseProps = {
  label: string;
  hint?: string;
  error?: string;
};

function describedById(id: string | undefined, suffix: string) {
  return id ? `${id}-${suffix}` : undefined;
}

export function FormField({
  label,
  hint,
  error,
  ...props
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  const hintId = describedById(props.id, "hint");
  const errorId = describedById(props.id, "error");
  const describedBy = [error ? errorId : null, hint && !error ? hintId : null]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className="creco-form-group">
      <label className="creco-form-label" htmlFor={props.id}>
        {label}
      </label>
      <input
        className="creco-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      />
      {hint && !error && (
        <p id={hintId} className="creco-form-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="creco-form-error" role="alert">
          {error}
        </p>
      )}
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
  const hintId = describedById(props.id, "hint");
  const errorId = describedById(props.id, "error");
  const describedBy = [error ? errorId : null, hint && !error ? hintId : null]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className="creco-form-group">
      <label className="creco-form-label" htmlFor={props.id}>
        {label}
      </label>
      <select
        className="creco-input creco-select"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      >
        {children}
      </select>
      {hint && !error && (
        <p id={hintId} className="creco-form-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="creco-form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormTextarea({
  label,
  hint,
  error,
  ...props
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const hintId = describedById(props.id, "hint");
  const errorId = describedById(props.id, "error");
  const describedBy = [error ? errorId : null, hint && !error ? hintId : null]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className="creco-form-group">
      <label className="creco-form-label" htmlFor={props.id}>
        {label}
      </label>
      <textarea
        className="creco-input creco-textarea"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      />
      {hint && !error && (
        <p id={hintId} className="creco-form-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="creco-form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
