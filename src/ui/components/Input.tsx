interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'date';
  placeholder?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
}

export function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  required = false,
  maxLength,
  className = ''
}: InputProps) {
  const hasError = Boolean(error);

  const inputStyles = hasError
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:ring-blue-500';

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputStyles}`}
      />

      {hasError && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
