interface TextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  className?: string;
}

export function Textarea({
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  maxLength,
  rows = 3,
  className = ''
}: TextareaProps) {
  const hasError = Boolean(error);

  const textareaStyles = hasError
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:ring-blue-500';

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none ${textareaStyles}`}
      />

      {hasError && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
