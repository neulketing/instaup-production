export default function FloatingKakao() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href="https://pf.kakao.com/_xfTmtd/friend"
        target="_blank"
        rel="noopener noreferrer"
        className="group bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 font-medium"
      >
        <img
          src="https://ext.same-assets.com/3036106235/748745620.svg"
          alt="카카오톡"
          className="w-6 h-6"
        />
        <span className="hidden sm:block">1:1 상담</span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      </a>
    </div>
  )
}
