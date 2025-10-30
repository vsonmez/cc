interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function Checkbox({
  checked,
  onChange,
  label,
  className = '',
  disabled = false
}: CheckboxProps) {
  return (
    <label
      className={`flex items-center gap-2 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
      />
      {label && <span className="text-sm text-gray-700 select-none">{label}</span>}
    </label>
  );
}
