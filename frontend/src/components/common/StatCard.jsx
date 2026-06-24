const StatCard = ({ label, value, color, suffix = '', isDark }) => {
  return (
    <div className={`rounded-xl p-5 border
      ${isDark
        ? 'bg-[#141414] border-[#232323]'
        : 'bg-white border-gray-200'}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${color || (isDark ? 'text-white' : 'text-gray-900')}`}>
        {value}
        {suffix && (
          <span className="text-sm ml-1 font-normal text-gray-500">
            {suffix}
          </span>
        )}
      </p>
    </div>
  )
}

export default StatCard