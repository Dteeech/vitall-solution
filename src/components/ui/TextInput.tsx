type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export function TextInput({ label, ...props }: TextInputProps) {
  return (
    <label className="flex flex-col gap-2 text-neutral-dark">
      {label && <span className="text-sm">{label}</span>}
      <input className="px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-neutral" {...props} />
    </label>
  )
}
