const InputField = ({ label, isDark, ...props }) => {
  const inputClass = `w-full px-3 py-2.5 rounded-lg text-sm
    focus:outline-none focus:ring-1 focus:ring-green-500/50
    ${isDark
      ? 'bg-[#0f0f0f] border border-[#2a2a2a] text-white placeholder-gray-700'
      : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'}`

  const labelClass = `block text-xs mb-1.5 text-gray-500`

  return (
    <div>
      {label && <label className={labelClass}>{label}</label>}
      <input className={inputClass} {...props} />
    </div>
  )
}

export default InputField