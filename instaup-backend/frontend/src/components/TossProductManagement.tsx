import type React from "react";
import { useEffect, useState } from "react";

// 토스 디자인 시스템 색상
const TossColors = {
  primary: "#3182F6",
  primaryHover: "#1B64DA",
  primaryLight: "#E8F3FF",
  secondary: "#F2F4F6",
  success: "#00C73C",
  warning: "#FFB800",
  error: "#F04452",
  text: {
    primary: "#191F28",
    secondary: "#6B7684",
    tertiary: "#8B95A1",
  },
  background: {
    primary: "#FFFFFF",
    secondary: "#F9FAFB",
  },
  border: "#E5E8EB",
};

// 상품 데이터 타입
interface Product {
  id: string;
  platform: string;
  category: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  minOrder: number;
  maxOrder: number;
  deliveryTime: string;
  quality: "standard" | "premium" | "vip";
  isActive: boolean;
  isPopular: boolean;
  isRecommended: boolean;
  totalOrders: number;
  totalRevenue: number;
  features: string[];
  warningNote?: string;
  // 추가된 필드들
  icon?: string; // 서비스 아이콘 (이모지)
  unit?: string; // 단위 (개, 회, 명 등)
  createdAt: string;
  updatedAt: string;
}

// API 서비스
class ProductAPI {
  private static baseURL =
    import.meta.env.VITE_BACKEND_API_URL ||
    "https://instaup-production.up.railway.app";

  static async getProducts(filters?: {
    category?: string;
    platform?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.platform) params.append("platform", filters.platform);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await fetch(
      `${this.baseURL}/api/admin/products?${params}`,
    );
    return response.json();
  }

  static async createProduct(product: Partial<Product>) {
    const response = await fetch(`${this.baseURL}/api/admin/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    return response.json();
  }

  static async updateProduct(id: string, product: Partial<Product>) {
    const response = await fetch(`${this.baseURL}/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    return response.json();
  }

  static async deleteProduct(id: string) {
    const response = await fetch(`${this.baseURL}/api/admin/products/${id}`, {
      method: "DELETE",
    });
    return response.json();
  }
}

// 토스 스타일 버튼 컴포넌트
const TossButton: React.FC<{
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}> = ({
  variant = "primary",
  size = "medium",
  children,
  onClick,
  disabled = false,
  icon,
}) => {
  const getButtonStyles = () => {
    const baseStyles =
      "font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2";

    const sizeStyles = {
      small: "px-3 py-1.5 text-sm",
      medium: "px-4 py-2.5 text-sm",
      large: "px-6 py-3 text-base",
    };

    const variantStyles = {
      primary: `bg-[${TossColors.primary}] hover:bg-[${TossColors.primaryHover}] text-white shadow-sm`,
      secondary: `bg-[${TossColors.secondary}] hover:bg-gray-200 text-[${TossColors.text.primary}]`,
      success: `bg-[${TossColors.success}] hover:bg-green-600 text-white`,
      warning: `bg-[${TossColors.warning}] hover:bg-yellow-600 text-white`,
      error: `bg-[${TossColors.error}] hover:bg-red-600 text-white`,
    };

    const disabledStyles = disabled
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer";

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles}`;
  };

  return (
    <button className={getButtonStyles()} onClick={onClick} disabled={disabled}>
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

// 토스 스타일 카드 컴포넌트
const TossCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}> = ({ children, className = "", hoverable = false }) => {
  const hoverEffect = hoverable ? "hover:shadow-lg hover:-translate-y-1" : "";

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-[${TossColors.border}] transition-all duration-200 ${hoverEffect} ${className}`}
    >
      {children}
    </div>
  );
};

// 플랫폼 아이콘 컴포넌트 개선
const PlatformIcon: React.FC<{
  platform: string;
  icon?: string;
  size?: number;
}> = ({ platform, icon, size = 24 }) => {
  const defaultIcons: { [key: string]: { emoji: string; color: string } } = {
    instagram: { emoji: "📷", color: "#E4405F" },
    youtube: { emoji: "🎥", color: "#FF0000" },
    tiktok: { emoji: "🎵", color: "#000000" },
    facebook: { emoji: "📘", color: "#1877F2" },
    twitter: { emoji: "🐦", color: "#1DA1F2" },
  };

  const defaultIcon = defaultIcons[platform] || {
    emoji: "📱",
    color: TossColors.primary,
  };
  const displayIcon = icon || defaultIcon.emoji;

  return (
    <div
      className="rounded-full flex items-center justify-center"
      style={{
        width: size,
        height: size,
        backgroundColor: `${defaultIcon.color}15`,
        fontSize: size * 0.6,
      }}
    >
      {displayIcon}
    </div>
  );
};

// 상품 카드 컴포넌트 개선
const ProductCard: React.FC<{
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onCopy: (product: Product) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
}> = ({ product, onEdit, onDelete, onCopy, onToggleStatus }) => {
  const qualityColors = {
    standard: TossColors.text.secondary,
    premium: TossColors.primary,
    vip: TossColors.warning,
  };

  const qualityBadges = {
    standard: { text: "STANDARD", bg: "bg-gray-100", color: "text-gray-600" },
    premium: { text: "PREMIUM", bg: "bg-blue-100", color: "text-blue-600" },
    vip: { text: "VIP", bg: "bg-yellow-100", color: "text-yellow-600" },
  };

  return (
    <TossCard hoverable className="p-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <PlatformIcon
            platform={product.platform}
            icon={product.icon}
            size={32}
          />
          <div>
            <h3 className="font-bold text-[#191F28] text-lg leading-tight">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium ${qualityBadges[product.quality].bg} ${qualityBadges[product.quality].color}`}
              >
                {qualityBadges[product.quality].text}
              </span>
              {product.isPopular && (
                <span className="px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-600">
                  인기
                </span>
              )}
              {product.isRecommended && (
                <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-600">
                  추천
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 상태 토글 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleStatus(product.id, !product.isActive)}
            className={`w-12 h-6 rounded-full transition-all duration-200 relative ${
              product.isActive ? "bg-[#3182F6]" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                product.isActive ? "left-6" : "left-0.5"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${product.isActive ? "text-[#3182F6]" : "text-gray-500"}`}
          >
            {product.isActive ? "활성" : "비활성"}
          </span>
        </div>
      </div>

      {/* 설명 */}
      <p className="text-[#6B7684] text-sm mb-4 line-clamp-3 leading-relaxed">
        {product.description}
      </p>

      {/* 가격 정보 */}
      <div className="bg-[#F9FAFB] rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#6B7684] text-sm">
            가격 (1{product.unit || "개"}당)
          </span>
          <div className="flex items-center gap-2">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 text-sm line-through">
                ₩{product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-[#191F28] font-bold text-lg">
              ₩{product.price.toLocaleString()}
            </span>
            {product.discount && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                -{product.discount}%
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[#6B7684]">최소 주문</span>
            <div className="font-medium text-[#191F28]">
              {product.minOrder.toLocaleString()}
              {product.unit || "개"}
            </div>
          </div>
          <div>
            <span className="text-[#6B7684]">최대 주문</span>
            <div className="font-medium text-[#191F28]">
              {product.maxOrder.toLocaleString()}
              {product.unit || "개"}
            </div>
          </div>
          <div>
            <span className="text-[#6B7684]">처리 시간</span>
            <div className="font-medium text-[#191F28]">
              {product.deliveryTime}
            </div>
          </div>
          <div>
            <span className="text-[#6B7684]">총 주문</span>
            <div className="font-medium text-[#191F28]">
              {product.totalOrders.toLocaleString()}건
            </div>
          </div>
        </div>
      </div>

      {/* 매출 정보 */}
      <div className="bg-[#E8F3FF] rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-[#3182F6] font-medium text-sm">총 매출</span>
          <span className="text-[#3182F6] font-bold text-lg">
            ₩{product.totalRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 특징 태그 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {product.features.slice(0, 3).map((feature, index) => (
          <span
            key={index}
            className="bg-[#F2F4F6] text-[#6B7684] text-xs px-3 py-1 rounded-full"
          >
            {feature}
          </span>
        ))}
        {product.features.length > 3 && (
          <span className="bg-[#F2F4F6] text-[#6B7684] text-xs px-3 py-1 rounded-full">
            +{product.features.length - 3}개 더
          </span>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-2">
        <TossButton
          variant="primary"
          size="small"
          onClick={() => onEdit(product)}
          icon="✏️"
        >
          수정
        </TossButton>

        <TossButton
          variant="secondary"
          size="small"
          onClick={() => onCopy(product)}
          icon="📋"
        >
          복사
        </TossButton>

        <TossButton
          variant="secondary"
          size="small"
          onClick={() => {
            const serviceInfo = `📋 서비스 정보

🏷️ 서비스명: ${product.name}
🌐 플랫폼: ${product.platform}
📂 카테고리: ${product.category}
💰 가격: ₩${product.price.toLocaleString()} / ${product.unit || '개'}
📊 주문량: ${product.minOrder.toLocaleString()} ~ ${product.maxOrder.toLocaleString()}${product.unit || '개'}
⏱️ 처리시간: ${product.deliveryTime}
⭐ 품질: ${product.quality === 'standard' ? '표준' : product.quality === 'premium' ? '프리미엄' : 'VIP'}
🎯 특징: ${product.features.join(', ')}

📝 설명:
${product.description}

📈 판매 현황:
- 총 주문: ${product.totalOrders.toLocaleString()}건
- 총 매출: ₩${product.totalRevenue.toLocaleString()}
- 상태: ${product.isActive ? '활성' : '비활성'}${product.isPopular ? ' | 인기상품' : ''}${product.isRecommended ? ' | 추천상품' : ''}

🆔 서비스 ID: ${product.id}`;

            navigator.clipboard.writeText(serviceInfo).then(() => {
              // 복사 성공 알림 (선택사항)
              console.log('서비스 정보가 클립보드에 복사되었습니다.');
            });
          }}
          icon="📋"
        >
          서비스 복사
        </TossButton>

        <TossButton
          variant="error"
          size="small"
          onClick={() => onDelete(product.id)}
          icon="🗑️"
        >
          삭제
        </TossButton>
      </div>
    </TossCard>
  );
};

// 상품 편집 모달 대폭 개선
const ProductEditModal: React.FC<{
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}> = ({ isOpen, product, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [featuresInput, setFeaturesInput] = useState("");

  useEffect(() => {
    if (product) {
      setFormData(product);
      setFeaturesInput(product.features?.join(", ") || "");
    } else {
      setFormData({
        platform: "instagram",
        category: "followers",
        name: "",
        description: "",
        price: 0,
        originalPrice: 0,
        discount: 0,
        minOrder: 1,
        maxOrder: 1000,
        deliveryTime: "1~24시간",
        quality: "standard",
        isActive: true,
        isPopular: false,
        isRecommended: false,
        features: [],
        icon: "📱",
        unit: "개",
        totalOrders: 0,
        totalRevenue: 0,
      });
      setFeaturesInput("");
    }
  }, [product]);

  const handleSave = () => {
    if (formData.name && formData.description && formData.price) {
      const features = featuresInput
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      onSave({
        ...formData,
        features,
      } as Product);
    }
  };

  // 카테고리별 아이콘 추천
  const getCategoryIcons = (category: string) => {
    const iconMap: { [key: string]: string[] } = {
      followers: ["👥", "👤", "🫂", "👫", "👬", "👭"],
      likes: ["❤️", "💖", "💝", "💕", "💗", "💓", "💘", "💞"],
      views: ["👁️", "👀", "🔍", "📊", "📈", "📺"],
      comments: ["💬", "🗨️", "💭", "📝", "✍️", "🗣️"],
      subscribers: ["🔔", "📻", "🎯", "⭐", "🌟", "✨"],
      reels_views: ["🎬", "🎥", "📽️", "🎞️", "🎪", "🎭"],
      story_views: ["📖", "📚", "📜", "📰", "📑", "📄"],
      retweets: ["🔄", "↩️", "🔁", "📢", "📣", "🗣️"],
      page_likes: ["👍", "👌", "✅", "💯", "🎉", "🥳"],
      comment_likes: ["💝", "👍", "💘", "❣️", "💖", "💕"],
    };
    return iconMap[category] || ["📱", "⚡", "🔥", "✨", "🎯", "🚀"];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E8EB] sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-[#191F28]">
            {product ? "상품 수정" : "새 상품 추가"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 폼 */}
        <div className="p-6 space-y-8">
          {/* 기본 정보 섹션 */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#191F28] mb-4 flex items-center gap-2">
              📋 기본 정보
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  플랫폼 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.platform || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, platform: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                >
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter/X</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  카테고리 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                >
                  <option value="followers">팔로워</option>
                  <option value="likes">좋아요</option>
                  <option value="views">조회수</option>
                  <option value="comments">댓글</option>
                  <option value="subscribers">구독자</option>
                  <option value="reels_views">릴스 조회수</option>
                  <option value="story_views">스토리 조회수</option>
                  <option value="comment_likes">댓글 좋아요</option>
                  <option value="page_likes">페이지 좋아요</option>
                  <option value="retweets">리트윗</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  서비스 아이콘 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4 mb-3">
                  <input
                    type="text"
                    value={formData.icon || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    placeholder="😍"
                    className="w-20 px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent text-center text-2xl"
                  />
                  <div className="flex-1">
                    <div className="text-sm text-[#6B7684] mb-2">
                      추천 아이콘:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getCategoryIcons(formData.category || "").map(
                        (icon, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon })}
                            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-lg transition-colors"
                          >
                            {icon}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  상품명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                  placeholder="예: 인스타그램 실제 한국 팔로워"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  상품 설명 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={6}
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent resize-none"
                  placeholder="서비스의 특징, 작업속도, 주문방법, 주의사항 등을 자세히 설명해주세요"
                />
              </div>
            </div>
          </div>

          {/* 가격 및 수량 섹션 */}
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#191F28] mb-4 flex items-center gap-2">
              💰 가격 및 수량 설정
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  판매 가격 (1개당) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  원가 (1개당)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.originalPrice || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      originalPrice: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  할인율 (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  단위
                </label>
                <select
                  value={formData.unit || "개"}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                >
                  <option value="개">개</option>
                  <option value="명">명</option>
                  <option value="회">회</option>
                  <option value="건">건</option>
                  <option value="번">번</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  최소 주문 수량 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.minOrder || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minOrder: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  최대 주문 수량 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.maxOrder || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxOrder: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                  placeholder="1000"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  처리 시간 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.deliveryTime || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, deliveryTime: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                  placeholder="예: 1~24시간, 즉시, 1~3일"
                />
              </div>
            </div>
          </div>

          {/* 품질 및 옵션 섹션 */}
          <div className="bg-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#191F28] mb-4 flex items-center gap-2">
              ⭐ 품질 및 옵션
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  품질 등급
                </label>
                <select
                  value={formData.quality || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, quality: e.target.value as any })
                  }
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                >
                  <option value="standard">Standard (표준)</option>
                  <option value="premium">Premium (프리미엄)</option>
                  <option value="vip">VIP (최고급)</option>
                </select>
              </div>

              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive || false}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-5 h-5 text-[#3182F6] border-2 border-gray-300 rounded focus:ring-[#3182F6]"
                  />
                  <span className="text-sm font-medium text-[#191F28]">
                    서비스 활성화 (고객에게 노출)
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular || false}
                    onChange={(e) =>
                      setFormData({ ...formData, isPopular: e.target.checked })
                    }
                    className="w-5 h-5 text-[#3182F6] border-2 border-gray-300 rounded focus:ring-[#3182F6]"
                  />
                  <span className="text-sm font-medium text-[#191F28]">
                    인기 상품으로 표시
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isRecommended || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isRecommended: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-[#3182F6] border-2 border-gray-300 rounded focus:ring-[#3182F6]"
                  />
                  <span className="text-sm font-medium text-[#191F28]">
                    추천 상품으로 표시
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* 특징 및 태그 섹션 */}
          <div className="bg-orange-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#191F28] mb-4 flex items-center gap-2">
              🏷️ 특징 및 태그
            </h3>

            <div>
              <label className="block text-sm font-medium text-[#191F28] mb-2">
                특징 태그 (쉼표로 구분)
              </label>
              <input
                type="text"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                placeholder="예: 실제 유저, 빠른 처리, 안전한 방식, 고품질"
              />
              <div className="text-xs text-[#6B7684] mt-1">
                쉼표(,)로 구분하여 여러 특징을 입력하세요
              </div>
              {featuresInput && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {featuresInput.split(",").map((feature, index) => (
                    <span
                      key={index}
                      className="bg-[#3182F6] text-white text-xs px-3 py-1 rounded-full"
                    >
                      {feature.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 경고 메모 섹션 */}
          <div className="bg-red-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#191F28] mb-4 flex items-center gap-2">
              ⚠️ 경고 및 주의사항
            </h3>

            <div>
              <label className="block text-sm font-medium text-[#191F28] mb-2">
                경고 메모 (선택사항)
              </label>
              <textarea
                value={formData.warningNote || ""}
                onChange={(e) =>
                  setFormData({ ...formData, warningNote: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent resize-none"
                placeholder="고객이 주의해야 할 사항이나 제한사항을 입력하세요"
              />
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex justify-end gap-3 p-6 border-t border-[#E5E8EB] sticky bottom-0 bg-white">
          <TossButton variant="secondary" onClick={onClose}>
            취소
          </TossButton>
          <TossButton variant="primary" onClick={handleSave}>
            {product ? "수정 완료" : "상품 추가"}
          </TossButton>
        </div>
      </div>
    </div>
  );
};

// 메인 상품 관리 컴포넌트
export default function TossProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    platform: "all",
    category: "all",
    status: "all",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // 데이터 로드
  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductAPI.getProducts(filters);
      if (response.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("상품 로드 실패:", error);
      // 백엔드 연결 실패 시 샘플 데이터 사용
      const sampleProducts: Product[] = [
        {
          id: 'instagram_21',
          platform: 'instagram',
          category: 'followers',
          name: '인스타 실제 한국 팔로워',
          description: '100% 실제 활동하는 한국인 유저들이 인스타 공식앱을 통해 직접 방문하여 팔로우를 눌러드리는 방식으로 안전하게 진행됩니다.',
          price: 180,
          originalPrice: 200,
          discount: 10,
          minOrder: 20,
          maxOrder: 3000000,
          deliveryTime: '1~6시간',
          quality: 'premium',
          isActive: true,
          isPopular: true,
          isRecommended: false,
          totalOrders: 1250,
          totalRevenue: 2250000,
          features: ['실제 한국인', '30일 AS', '안전한 방식', '프리미엄 품질'],
          icon: '📷',
          unit: '개',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'instagram_56',
          platform: 'instagram',
          category: 'likes',
          name: '인스타 좋아요',
          description: '인스타그램 게시물의 좋아요를 자연스럽게 증가시켜드립니다.',
          price: 15,
          originalPrice: 20,
          discount: 25,
          minOrder: 10,
          maxOrder: 50000,
          deliveryTime: '1~30분',
          quality: 'premium',
          isActive: true,
          isPopular: true,
          isRecommended: true,
          totalOrders: 890,
          totalRevenue: 1335000,
          features: ['빠른 시작', '30일 AS', '안전한 방식', '자연스러운 증가'],
          icon: '❤️',
          unit: '개',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'youtube_01',
          platform: 'youtube',
          category: 'subscribers',
          name: '유튜브 구독자',
          description: '유튜브 채널의 구독자를 늘려드립니다.',
          price: 25,
          originalPrice: 30,
          discount: 16,
          minOrder: 10,
          maxOrder: 100000,
          deliveryTime: '1~24시간',
          quality: 'premium',
          isActive: true,
          isPopular: true,
          isRecommended: false,
          totalOrders: 567,
          totalRevenue: 1417500,
          features: ['실제 유저', '안전한 방식', '빠른 시작', '고품질'],
          icon: '🎥',
          unit: '명',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'tiktok_01',
          platform: 'tiktok',
          category: 'followers',
          name: '틱톡 팔로워',
          description: '틱톡 계정의 팔로워를 늘려드립니다.',
          price: 30,
          originalPrice: 35,
          discount: 14,
          minOrder: 20,
          maxOrder: 50000,
          deliveryTime: '1~24시간',
          quality: 'premium',
          isActive: true,
          isPopular: false,
          isRecommended: true,
          totalOrders: 234,
          totalRevenue: 702000,
          features: ['실제 유저', '안전한 방식', '고품질', '빠른 시작'],
          icon: '🎵',
          unit: '명',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // 상품 복사 기능 추가
  const handleCopy = (product: Product) => {
    const copiedProduct = {
      ...product,
      id: undefined, // 새 ID 생성을 위해 undefined
      name: `${product.name} (복사본)`,
      totalOrders: 0,
      totalRevenue: 0,
      isActive: false, // 복사본은 비활성 상태로 시작
    };
    setEditingProduct(copiedProduct as Product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말 이 상품을 삭제하시겠습니까?")) {
      try {
        const response = await ProductAPI.deleteProduct(id);
        if (response.success) {
          loadProducts();
        }
      } catch (error) {
        console.error("상품 삭제 실패:", error);
      }
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await ProductAPI.updateProduct(id, { isActive });
      if (response.success) {
        loadProducts();
      }
    } catch (error) {
      console.error("상품 상태 변경 실패:", error);
    }
  };

  const handleSave = async (product: Product) => {
    try {
      let response;
      if (editingProduct && editingProduct.id) {
        response = await ProductAPI.updateProduct(product.id, product);
      } else {
        response = await ProductAPI.createProduct(product);
      }

      if (response.success) {
        setIsModalOpen(false);
        setEditingProduct(null);
        loadProducts();
      }
    } catch (error) {
      console.error("상품 저장 실패:", error);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const stats = {
    total: products.length,
    active: products.filter((p) => p.isActive).length,
    popular: products.filter((p) => p.isPopular).length,
    totalRevenue: products.reduce((sum, p) => sum + p.totalRevenue, 0),
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#191F28] mb-2">
                📦 상품 관리
              </h1>
              <p className="text-[#6B7684] text-lg">
                서비스 상품을 효율적으로 관리하고 주문 페이지에 실시간으로
                반영하세요
              </p>
            </div>
            <TossButton
              variant="primary"
              size="large"
              onClick={handleAddNew}
              icon="+"
            >
              새 상품 추가
            </TossButton>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <TossCard className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#191F28] mb-1">
                  {stats.total}
                </div>
                <div className="text-[#6B7684] text-sm">전체 상품</div>
              </div>
            </TossCard>

            <TossCard className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#3182F6] mb-1">
                  {stats.active}
                </div>
                <div className="text-[#6B7684] text-sm">활성 상품</div>
              </div>
            </TossCard>

            <TossCard className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00C73C] mb-1">
                  {stats.popular}
                </div>
                <div className="text-[#6B7684] text-sm">인기 상품</div>
              </div>
            </TossCard>

            <TossCard className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FFB800] mb-1">
                  ₩{(stats.totalRevenue / 1000000).toFixed(1)}M
                </div>
                <div className="text-[#6B7684] text-sm">총 매출</div>
              </div>
            </TossCard>
          </div>

          {/* 필터 */}
          <TossCard className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  검색
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  placeholder="상품명으로 검색"
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  플랫폼
                </label>
                <select
                  value={filters.platform}
                  onChange={(e) =>
                    setFilters({ ...filters, platform: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                >
                  <option value="all">전체</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  카테고리
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                >
                  <option value="all">전체</option>
                  <option value="followers">팔로워</option>
                  <option value="likes">좋아요</option>
                  <option value="views">조회수</option>
                  <option value="comments">댓글</option>
                  <option value="subscribers">구독자</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  상태
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                >
                  <option value="all">전체</option>
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                </select>
              </div>
            </div>
          </TossCard>
        </div>

        {/* 상품 그리드 */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-[#3182F6] border-t-transparent rounded-full"></div>
            <span className="ml-3 text-[#6B7684]">로딩 중...</span>
          </div>
        ) : products.length === 0 ? (
          <TossCard className="p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-[#191F28] mb-2">
              상품이 없습니다
            </h3>
            <p className="text-[#6B7684] mb-6">첫 번째 상품을 추가해보세요</p>
            <TossButton variant="primary" onClick={handleAddNew}>
              상품 추가하기
            </TossButton>
          </TossCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onCopy={handleCopy}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}

        {/* 편집 모달 */}
        <ProductEditModal
          isOpen={isModalOpen}
          product={editingProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
