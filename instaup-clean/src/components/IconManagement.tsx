import React, { useState, useEffect } from "react";

// 플랫폼별 아이콘 데이터 타입
interface PlatformIcon {
  id: string;
  platform: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  description: string;
  isActive: boolean;
}

// 기본 아이콘 데이터
const defaultIcons: PlatformIcon[] = [
  {
    id: "instagram",
    platform: "instagram",
    name: "인스타그램",
    emoji: "👑",
    color: "#E4405F",
    bgColor: "from-pink-500 to-purple-600",
    description: "인스타그램 팔로워, 좋아요 서비스",
    isActive: true,
  },
  {
    id: "youtube",
    platform: "youtube",
    name: "유튜브",
    emoji: "🎬",
    color: "#FF0000",
    bgColor: "from-red-500 to-red-600",
    description: "유튜브 구독자, 조회수 서비스",
    isActive: true,
  },
  {
    id: "tiktok",
    platform: "tiktok",
    name: "틱톡",
    emoji: "🎵",
    color: "#000000",
    bgColor: "from-black to-gray-800",
    description: "틱톡 팔로워, 좋아요 서비스",
    isActive: true,
  },
  {
    id: "facebook",
    platform: "facebook",
    name: "페이스북",
    emoji: "📘",
    color: "#1877F2",
    bgColor: "from-blue-600 to-blue-700",
    description: "페이스북 페이지 좋아요, 팔로워 서비스",
    isActive: true,
  },
  {
    id: "twitter",
    platform: "twitter",
    name: "트위터 (X)",
    emoji: "🐦",
    color: "#1DA1F2",
    bgColor: "from-blue-400 to-blue-500",
    description: "트위터 팔로워, 리트윗 서비스",
    isActive: false,
  },
  {
    id: "discord",
    platform: "discord",
    name: "디스코드",
    emoji: "🎮",
    color: "#5865F2",
    bgColor: "from-indigo-500 to-purple-600",
    description: "디스코드 멤버, 서버 부스팅",
    isActive: false,
  },
];

// 이모지 선택 옵션
const availableEmojis = [
  "👑",
  "🎬",
  "🎵",
  "📘",
  "🐦",
  "🎮",
  "❤️",
  "👥",
  "🔥",
  "⭐",
  "💎",
  "🚀",
  "📱",
  "💻",
  "🎯",
  "🏆",
  "🌟",
  "⚡",
  "🎨",
  "🎪",
  "🎭",
  "🎸",
  "🎤",
  "🎧",
];

export default function IconManagement() {
  const [icons, setIcons] = useState<PlatformIcon[]>(defaultIcons);
  const [editingIcon, setEditingIcon] = useState<PlatformIcon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 로컬스토리지에서 아이콘 설정 로드
  useEffect(() => {
    const savedIcons = localStorage.getItem("platformIcons");
    if (savedIcons) {
      try {
        setIcons(JSON.parse(savedIcons));
      } catch (error) {
        console.error("Failed to load saved icons:", error);
      }
    }
  }, []);

  // 아이콘 설정 저장
  const saveIcons = (newIcons: PlatformIcon[]) => {
    setIcons(newIcons);
    localStorage.setItem("platformIcons", JSON.stringify(newIcons));
  };

  // 아이콘 편집 시작
  const startEditing = (icon: PlatformIcon) => {
    setEditingIcon({ ...icon });
    setIsModalOpen(true);
  };

  // 새 아이콘 추가
  const addNewIcon = () => {
    const newIcon: PlatformIcon = {
      id: `custom_${Date.now()}`,
      platform: "",
      name: "",
      emoji: "🎯",
      color: "#6366F1",
      bgColor: "from-indigo-500 to-purple-600",
      description: "",
      isActive: true,
    };
    setEditingIcon(newIcon);
    setIsModalOpen(true);
  };

  // 아이콘 저장
  const saveIcon = () => {
    if (!editingIcon) return;

    const updatedIcons = [...icons];
    const existingIndex = updatedIcons.findIndex(
      (icon) => icon.id === editingIcon.id,
    );

    if (existingIndex >= 0) {
      updatedIcons[existingIndex] = editingIcon;
    } else {
      updatedIcons.push(editingIcon);
    }

    saveIcons(updatedIcons);
    setIsModalOpen(false);
    setEditingIcon(null);
  };

  // 아이콘 삭제
  const deleteIcon = (iconId: string) => {
    if (confirm("정말 이 아이콘을 삭제하시겠습니까?")) {
      const updatedIcons = icons.filter((icon) => icon.id !== iconId);
      saveIcons(updatedIcons);
    }
  };

  // 아이콘 활성화/비활성화 토글
  const toggleIconActive = (iconId: string) => {
    const updatedIcons = icons.map((icon) =>
      icon.id === iconId ? { ...icon, isActive: !icon.isActive } : icon,
    );
    saveIcons(updatedIcons);
  };

  // 필터링된 아이콘들
  const filteredIcons = icons.filter(
    (icon) =>
      icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.platform.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🎨 아이콘 관리</h2>
          <p className="text-gray-600 mt-1">
            서비스 플랫폼 아이콘을 관리하고 편집하세요
          </p>
        </div>
        <button
          onClick={addNewIcon}
          className="px-4 py-2 bg-gradient-to-r from-[#22426f] to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          + 새 아이콘 추가
        </button>
      </div>

      {/* 검색 바 */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="아이콘 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22426f] focus:border-transparent"
        />
      </div>

      {/* 아이콘 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIcons.map((icon) => (
          <div
            key={icon.id}
            className={`border-2 rounded-lg p-4 transition-all ${
              icon.isActive
                ? "border-green-300 bg-green-50"
                : "border-gray-200 bg-gray-50 opacity-60"
            }`}
          >
            {/* 아이콘 미리보기 */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${icon.bgColor} rounded-full flex items-center justify-center text-2xl shadow-lg`}
              >
                {icon.emoji}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{icon.name}</h3>
                <p className="text-sm text-gray-600">{icon.platform}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: icon.color }}
                  />
                  <span className="text-xs text-gray-500">{icon.color}</span>
                </div>
              </div>
            </div>

            {/* 설명 */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {icon.description}
            </p>

            {/* 액션 버튼들 */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(icon)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  편집
                </button>
                {!["instagram", "youtube", "tiktok", "facebook"].includes(
                  icon.id,
                ) && (
                  <button
                    onClick={() => deleteIcon(icon.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    삭제
                  </button>
                )}
              </div>

              <button
                onClick={() => toggleIconActive(icon.id)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  icon.isActive
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {icon.isActive ? "활성" : "비활성"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 편집 모달 */}
      {isModalOpen && editingIcon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">
              {icons.find((i) => i.id === editingIcon.id)
                ? "아이콘 편집"
                : "새 아이콘 추가"}
            </h3>

            <div className="space-y-4">
              {/* 플랫폼 이름 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  플랫폼 ID
                </label>
                <input
                  type="text"
                  value={editingIcon.platform}
                  onChange={(e) =>
                    setEditingIcon({ ...editingIcon, platform: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#22426f]"
                  placeholder="예: instagram, youtube"
                />
              </div>

              {/* 표시 이름 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  표시 이름
                </label>
                <input
                  type="text"
                  value={editingIcon.name}
                  onChange={(e) =>
                    setEditingIcon({ ...editingIcon, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#22426f]"
                  placeholder="예: 인스타그램"
                />
              </div>

              {/* 이모지 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  아이콘 이모지
                </label>
                <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                  {availableEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setEditingIcon({ ...editingIcon, emoji })}
                      className={`w-8 h-8 text-lg hover:bg-gray-100 rounded ${
                        editingIcon.emoji === emoji
                          ? "bg-blue-100 ring-2 ring-blue-500"
                          : ""
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* 색상 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  브랜드 색상
                </label>
                <input
                  type="color"
                  value={editingIcon.color}
                  onChange={(e) =>
                    setEditingIcon({ ...editingIcon, color: e.target.value })
                  }
                  className="w-full h-10 border border-gray-300 rounded"
                />
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  value={editingIcon.description}
                  onChange={(e) =>
                    setEditingIcon({
                      ...editingIcon,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#22426f]"
                  rows={3}
                  placeholder="서비스 설명을 입력하세요"
                />
              </div>

              {/* 미리보기 */}
              <div className="border rounded p-3 bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">미리보기:</p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${editingIcon.bgColor} rounded-full flex items-center justify-center text-xl`}
                  >
                    {editingIcon.emoji}
                  </div>
                  <div>
                    <p className="font-medium">
                      {editingIcon.name || "이름 없음"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {editingIcon.platform || "플랫폼 없음"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 버튼들 */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={saveIcon}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#22426f] to-blue-600 text-white rounded-lg hover:shadow-lg"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 통계 */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-[#22426f]">{icons.length}</p>
            <p className="text-sm text-gray-600">총 아이콘</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {icons.filter((i) => i.isActive).length}
            </p>
            <p className="text-sm text-gray-600">활성 아이콘</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-600">
              {icons.filter((i) => !i.isActive).length}
            </p>
            <p className="text-sm text-gray-600">비활성 아이콘</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {icons.filter((i) => i.id.startsWith("custom_")).length}
            </p>
            <p className="text-sm text-gray-600">커스텀 아이콘</p>
          </div>
        </div>
      </div>
    </div>
  );
}
