interface SelectOption {
  value: string | number
  label: string
}

interface SelectProps {
  label: string
  value: string | number
  onChange: (value: string | number) => void
  options: SelectOption[]
  error?: string
  required?: boolean
  className?: string
}

export function Select({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  className = ''
}: SelectProps) {
  const hasError = Boolean(error)

  const selectStyles = hasError
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:ring-blue-500'

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => {
          const selectedValue = e.target.value
          // Why: Convert back to number if original value was number type
          const parsedValue = typeof value === 'number'
            ? Number(selectedValue)
            : selectedValue
          onChange(parsedValue)
        }}
        className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white ${selectStyles}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {hasError && (
        <span className="text-sm text-red-600">{error}</span>
      )}
    </div>
  )
}
