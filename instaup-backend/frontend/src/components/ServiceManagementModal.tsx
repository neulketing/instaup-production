import { useEffect, useState } from "react";
import type { ServiceData } from "../services/adminApi";

interface ServiceIcon {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

const PREDEFINED_ICONS: ServiceIcon[] = [
  // 추천 서비스 아이콘
  { id: "star", name: "추천서비스", emoji: "⭐", category: "featured" },
  { id: "event", name: "이벤트", emoji: "🎁", category: "featured" },
  { id: "popular", name: "상위노출", emoji: "👑", category: "featured" },
  { id: "target", name: "계정관리", emoji: "🎯", category: "featured" },
  { id: "package", name: "패키지", emoji: "📦", category: "featured" },
  {
    id: "instagram-pic",
    name: "인스타그램",
    emoji: "📷",
    category: "featured",
  },

  // SNS 플랫폼
  { id: "youtube", name: "유튜브", emoji: "🎥", category: "platform" },
  { id: "facebook", name: "페이스북", emoji: "📘", category: "platform" },
  { id: "music", name: "틱톡", emoji: "🎵", category: "platform" },
  { id: "link", name: "스레드", emoji: "🔗", category: "platform" },
  { id: "twitter", name: "트위터", emoji: "🐦", category: "platform" },
  { id: "document", name: "뉴스피드", emoji: "📰", category: "platform" },
  { id: "store", name: "카카오", emoji: "🛒", category: "platform" },
  { id: "shop", name: "스마트케어", emoji: "🏪", category: "platform" },
  { id: "target2", name: "어플마케팅", emoji: "🎯", category: "platform" },
  { id: "seo", name: "SEO트래픽", emoji: "🔍", category: "platform" },
  { id: "other", name: "기타", emoji: "📋", category: "platform" },
];

interface ServiceManagementModalProps {
  isOpen: boolean;
  service: ServiceData | null;
  mode: "create" | "edit" | "view";
  onSave: (serviceData: Partial<ServiceData>) => void;
  onCopy: (service: ServiceData) => void;
  onToggleVisibility: (serviceId: string, isHidden: boolean) => void;
  onDelete: (serviceId: string) => void;
  onClose: () => void;
}

export default function ServiceManagementModal({
  isOpen,
  service,
  mode,
  onSave,
  onCopy,
  onToggleVisibility,
  onDelete,
  onClose,
}: ServiceManagementModalProps) {
  const [formData, setFormData] = useState<Partial<ServiceData>>({
    name: "",
    platform: "",
    category: "",
    price: 0,
    minOrder: 1,
    maxOrder: 10000,
    isActive: true,
    isHidden: false,
    description: "",
    deliveryTime: "1-24시간",
  });

  const [selectedIcon, setSelectedIcon] = useState<ServiceIcon | null>(null);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [uploadedIcon, setUploadedIcon] = useState<string | null>(null);
  const [iconCategories] = useState(["featured", "platform"]);

  useEffect(() => {
    if (service && (mode === "edit" || mode === "view")) {
      setFormData(service);
      // 기존 서비스의 아이콘 설정이 있다면 로드
      const existingIcon = PREDEFINED_ICONS.find(
        (icon) => icon.name === service.platform,
      );
      if (existingIcon) {
        setSelectedIcon(existingIcon);
      }
    } else {
      setFormData({
        name: "",
        platform: "",
        category: "",
        price: 0,
        minOrder: 1,
        maxOrder: 10000,
        isActive: true,
        isHidden: false,
        description: "",
        deliveryTime: "1-24시간",
      });
      setSelectedIcon(null);
      setUploadedIcon(null);
    }
  }, [service, mode]);

  const handleInputChange = (field: keyof ServiceData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedIcon(e.target?.result as string);
        setSelectedIcon(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconSelect = (icon: ServiceIcon) => {
    setSelectedIcon(icon);
    setUploadedIcon(null);
    setShowIconSelector(false);

    // 아이콘 선택 시 플랫폼 자동 설정
    if (icon.category === "platform") {
      handleInputChange("platform", icon.name);
    }
  };

  const handleSave = () => {
    const serviceData = {
      ...formData,
      icon: uploadedIcon || selectedIcon?.emoji || "📋",
      iconId: selectedIcon?.id,
    };
    onSave(serviceData);
  };

  const handleCopy = () => {
    if (service) {
      onCopy(service);
    }
  };

  const handleToggleVisibility = () => {
    if (service) {
      onToggleVisibility(service.id, !service.isHidden);
    }
  };

  const handleDelete = () => {
    if (service && confirm("정말로 이 서비스를 삭제하시겠습니까?")) {
      onDelete(service.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {mode === "create"
                ? "새 서비스 추가"
                : mode === "edit"
                  ? "서비스 수정"
                  : "서비스 상세정보"}
            </h2>
            {service && (
              <p className="text-sm text-gray-600 mt-1">
                생성일:{" "}
                {new Date(service.createdAt).toLocaleDateString("ko-KR")}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {mode !== "create" && service && (
              <>
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  title="서비스 복사"
                >
                  📋 복사
                </button>
                <button
                  onClick={handleToggleVisibility}
                  className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                    service.isHidden
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "bg-gray-600 text-white hover:bg-gray-700"
                  }`}
                  title={service.isHidden ? "서비스 표시하기" : "서비스 숨기기"}
                >
                  {service.isHidden ? "👁️ 표시" : "🙈 숨기기"}
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  title="서비스 삭제"
                >
                  🗑️ 삭제
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 본문 */}
        <div className="p-6 space-y-6">
          {/* 아이콘 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              서비스 아이콘
            </label>
            <div className="flex items-center gap-4">
              {/* 선택된 아이콘 미리보기 */}
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                {uploadedIcon ? (
                  <img
                    src={uploadedIcon}
                    alt="업로드된 아이콘"
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : selectedIcon ? (
                  <span className="text-3xl">{selectedIcon.emoji}</span>
                ) : (
                  <span className="text-gray-400 text-2xl">📋</span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                {/* 미리 정의된 아이콘 선택 */}
                <button
                  type="button"
                  onClick={() => setShowIconSelector(!showIconSelector)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  disabled={mode === "view"}
                >
                  🎨 추천 아이콘 선택
                </button>

                {/* 이미지 업로드 */}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIconUpload}
                    className="hidden"
                    id="icon-upload"
                    disabled={mode === "view"}
                  />
                  <label
                    htmlFor="icon-upload"
                    className={`inline-block px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm cursor-pointer ${
                      mode === "view" ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    📁 이미지 업로드
                  </label>
                </div>

                {selectedIcon && (
                  <p className="text-sm text-gray-600">
                    선택된 아이콘: {selectedIcon.name} {selectedIcon.emoji}
                  </p>
                )}
              </div>
            </div>

            {/* 아이콘 선택기 */}
            {showIconSelector && mode !== "view" && (
              <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                {iconCategories.map((category) => (
                  <div key={category} className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {category === "featured"
                        ? "🌟 추천 서비스"
                        : "📱 SNS 플랫폼"}
                    </h4>
                    <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                      {PREDEFINED_ICONS.filter(
                        (icon) => icon.category === category,
                      ).map((icon) => (
                        <button
                          key={icon.id}
                          onClick={() => handleIconSelect(icon)}
                          className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                            selectedIcon?.id === icon.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          title={icon.name}
                        >
                          <span className="text-2xl">{icon.emoji}</span>
                          <div className="text-xs text-gray-600 mt-1 truncate">
                            {icon.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                서비스명 *
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: Instagram 팔로워"
                disabled={mode === "view"}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                플랫폼 *
              </label>
              <select
                value={formData.platform || ""}
                onChange={(e) => handleInputChange("platform", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={mode === "view"}
                required
              >
                <option value="">플랫폼 선택</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="TikTok">TikTok</option>
                <option value="Facebook">Facebook</option>
                <option value="Twitter">Twitter</option>
                <option value="카카오">카카오</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              <select
                value={formData.category || ""}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={mode === "view"}
                required
              >
                <option value="">카테고리 선택</option>
                <option value="팔로워">팔로워</option>
                <option value="좋아요">좋아요</option>
                <option value="조회수">조회수</option>
                <option value="댓글">댓글</option>
                <option value="구독자">구독자</option>
                <option value="공유">공유</option>
                <option value="저장">저장</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                가격 (100개당 원) *
              </label>
              <input
                type="number"
                value={formData.price || 0}
                onChange={(e) =>
                  handleInputChange("price", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                disabled={mode === "view"}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                최소 주문량
              </label>
              <input
                type="number"
                value={formData.minOrder || 1}
                onChange={(e) =>
                  handleInputChange("minOrder", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                disabled={mode === "view"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                최대 주문량
              </label>
              <input
                type="number"
                value={formData.maxOrder || 10000}
                onChange={(e) =>
                  handleInputChange("maxOrder", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                disabled={mode === "view"}
              />
            </div>
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              서비스 설명
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="서비스에 대한 자세한 설명을 입력하세요"
              disabled={mode === "view"}
            />
          </div>

          {/* 배송 시간 및 상태 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                배송 시간
              </label>
              <input
                type="text"
                value={formData.deliveryTime || ""}
                onChange={(e) =>
                  handleInputChange("deliveryTime", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 1-24시간"
                disabled={mode === "view"}
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive || false}
                  onChange={(e) =>
                    handleInputChange("isActive", e.target.checked)
                  }
                  className="mr-2"
                  disabled={mode === "view"}
                />
                <span className="text-sm font-medium text-gray-700">
                  서비스 활성화
                </span>
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isHidden || false}
                  onChange={(e) =>
                    handleInputChange("isHidden", e.target.checked)
                  }
                  className="mr-2"
                  disabled={mode === "view"}
                />
                <span className="text-sm font-medium text-gray-700">
                  서비스 숨김
                </span>
              </label>
            </div>
          </div>

          {/* 통계 정보 (수정/조회 모드에서만 표시) */}
          {(mode === "edit" || mode === "view") && service && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">총 주문 수</div>
                <div className="text-lg font-semibold text-gray-900">
                  {service.totalOrders?.toLocaleString() || 0}건
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">총 매출</div>
                <div className="text-lg font-semibold text-gray-900">
                  ₩{service.totalRevenue?.toLocaleString() || 0}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">마지막 업데이트</div>
                <div className="text-lg font-semibold text-gray-900">
                  {new Date(service.updatedAt).toLocaleDateString("ko-KR")}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        {mode !== "view" && (
          <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {mode === "create" ? "서비스 추가" : "변경사항 저장"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
