interface LogoProps {
  className?: string
  white?: boolean
}

export default function Logo({ className = "h-8", white = false }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        {/* Instagram-like gradient circle */}
        <div className={`w-10 h-10 rounded-2xl ${
          white
            ? 'bg-white'
            : 'bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400'
        } p-0.5`}>
          <div className={`w-full h-full rounded-2xl ${
            white
              ? 'bg-gray-800'
              : 'bg-white'
          } flex items-center justify-center`}>
            <span className={`text-xl font-black ${
              white
                ? 'text-white'
                : 'bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent'
            }`}>
              ↗
            </span>
          </div>
        </div>
      </div>

      <div className="ml-3">
        <div className={`text-xl font-black ${
          white ? 'text-white' : 'text-gray-900'
        }`}>
          INSTA<span className={
            white
              ? 'text-purple-300'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
          }>UP</span>
        </div>
        <div className={`text-xs font-medium ${
          white ? 'text-gray-300' : 'text-gray-500'
        } -mt-1`}>
          SNS 성장 플랫폼
        </div>
      </div>
    </div>
  )
}
