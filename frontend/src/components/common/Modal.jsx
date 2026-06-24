const Modal = ({ show, onClose, children, isDark, maxWidth = 'max-w-lg' }) => {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose} />
      <div className={`relative z-10 w-full ${maxWidth} rounded-2xl shadow-2xl
        max-h-[90vh] overflow-y-auto
        ${isDark
          ? 'bg-[#141414] border border-[#232323]'
          : 'bg-white border border-gray-200'}`}>
        {children}
      </div>
    </div>
  )
}

export default Modal