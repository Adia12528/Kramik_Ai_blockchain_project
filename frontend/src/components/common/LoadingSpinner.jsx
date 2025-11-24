import React from 'react'

const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin`}></div>
        <div className={`${sizeClasses[size]} border-4 border-transparent border-t-purple-600 rounded-full animate-spin absolute top-0 left-0`} style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
      </div>
      {text && (
        <p className="text-gray-600 font-medium animate-pulse">{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}

export default LoadingSpinner
