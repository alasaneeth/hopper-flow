const PageHeader = ({ title, subtitle, isDark, action }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className={`text-2xl font-semibold
          ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex gap-3">{action}</div>}
    </div>
  )
}

export default PageHeader