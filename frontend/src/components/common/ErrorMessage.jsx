import React from 'react'

const ErrorMessage = ({ 
  title = 'Oops! Something went wrong', 
  message = 'An error occurred. Please try again later.', 
  onRetry = null,
  type = 'error' // 'error', 'warning', 'info'
}) => {
  const typeConfig = {
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      iconColor: 'text-red-500',
      textColor: 'text-red-700',
      buttonColor: 'bg-red-600 hover:bg-red-700',
      icon: '❌'
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-700',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
      icon: '⚠️'
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-700',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      icon: 'ℹ️'
    }
  }

  const config = typeConfig[type]

  return (
    <div className={`${config.bgColor} ${config.borderColor} border-l-4 p-6 rounded-lg shadow-lg animate-fadeIn`}>
      <div className="flex items-start">
        <div className={`${config.iconColor} text-3xl mr-4 flex-shrink-0`}>
          {config.icon}
        </div>
        <div className="flex-1">
          <h3 className={`${config.textColor} font-bold text-lg mb-2`}>{title}</h3>
          <p className={`${config.textColor} text-sm mb-4`}>{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className={`${config.buttonColor} text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage
