import { useEffect, useState } from "react";
import {
  type ProductData,
  type ServiceData,
  adminApi,
} from "../services/adminApi";

interface ProductManagementProps {
  services: ServiceData[];
}

interface ProductFormData
  extends Omit<ProductData, "id" | "createdAt" | "updatedAt"> {}

export default function ProductManagement({
  services,
}: ProductManagementProps) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(
    null,
  );
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getProducts();
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("상품 목록 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleEditProduct = (product: ProductData) => {
    setSelectedProduct(product);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleViewProduct = (product: ProductData) => {
    setSelectedProduct(product);
    setModalMode("view");
    setShowModal(true);
  };

  const handleCopyProduct = async (product: ProductData) => {
    try {
      const copiedProduct: ProductFormData = {
        ...product,
        name: `${product.name} (복사본)`,
        totalOrders: 0,
        totalRevenue: 0,
        isActive: false, // 복사된 상품은 기본적으로 비활성화
      };

      const response = await adminApi.createProduct(copiedProduct);
      if (response.success && response.data) {
        setProducts((prev) => [...prev, response.data]);
        alert("상품이 성공적으로 복사되었습니다.");
      }
    } catch (error) {
      console.error("상품 복사 실패:", error);
      alert("상품 복사에 실패했습니다.");
    }
  };

  const handleToggleVisibility = async (
    productId: string,
    isHidden: boolean,
  ) => {
    try {
      const response = await adminApi.updateProduct(productId, { isHidden });
      if (response.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, isHidden } : p)),
        );
        alert(`상품이 ${isHidden ? "숨김" : "표시"} 처리되었습니다.`);
      }
    } catch (error) {
      console.error("상품 표시 상태 변경 실패:", error);
      alert("상품 표시 상태 변경에 실패했습니다.");
    }
  };

  const handleToggleActive = async (productId: string, isActive: boolean) => {
    try {
      const response = await adminApi.updateProduct(productId, { isActive });
      if (response.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, isActive } : p)),
        );
        alert(`상품이 ${isActive ? "활성화" : "비활성화"} 되었습니다.`);
      }
    } catch (error) {
      console.error("상품 활성화 상태 변경 실패:", error);
      alert("상품 활성화 상태 변경에 실패했습니다.");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("정말로 이 상품을 삭제하시겠습니까?")) return;

    try {
      const response = await adminApi.deleteProduct(productId);
      if (response.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        alert("상품이 성공적으로 삭제되었습니다.");
      }
    } catch (error) {
      console.error("상품 삭제 실패:", error);
      alert("상품 삭제에 실패했습니다.");
    }
  };

  const handleSaveProduct = async (productData: ProductFormData) => {
    try {
      if (modalMode === "create") {
        const response = await adminApi.createProduct(productData);
        if (response.success && response.data) {
          setProducts((prev) => [...prev, response.data]);
        }
      } else if (modalMode === "edit" && selectedProduct) {
        const response = await adminApi.updateProduct(
          selectedProduct.id,
          productData,
        );
        if (response.success && response.data) {
          setProducts((prev) =>
            prev.map((p) => (p.id === selectedProduct.id ? response.data! : p)),
          );
        }
      }
      setShowModal(false);
      alert("상품이 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("상품 저장 실패:", error);
      alert("상품 저장에 실패했습니다.");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">상품 목록을 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📦 상품 관리</h2>
          <p className="text-gray-600">
            서비스를 패키지로 묶어서 판매하는 상품을 관리합니다
          </p>
        </div>
        <button
          onClick={handleCreateProduct}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 새 상품 추가
        </button>
      </div>

      {/* 필터 */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              검색
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="상품명, 설명 검색..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              총 {filteredProducts.length}개 상품
            </div>
          </div>
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            {/* 상품 이미지/아이콘 */}
            <div className="h-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-lg flex items-center justify-center">
              {product.icon ? (
                <img
                  src={product.icon}
                  alt={product.name}
                  className="h-16 w-16 object-cover rounded"
                />
              ) : (
                <span className="text-4xl">📦</span>
              )}
            </div>

            <div className="p-4">
              {/* 상품 정보 */}
              <div className="flex items-start justify-between mb-2">
                <h3
                  className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                  onClick={() => handleViewProduct(product)}
                >
                  {product.name}
                </h3>
                <div className="flex items-center gap-1">
                  {product.isFeatured && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      추천
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      product.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.isActive ? "활성" : "비활성"}
                  </span>
                  {product.isHidden && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      숨김
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>

              {/* 가격 정보 */}
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    ₩{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₩{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  {product.discount && (
                    <span className="text-sm text-red-600 font-medium">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  카테고리: {product.category}
                </div>
              </div>

              {/* 포함된 서비스 */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  포함 서비스:
                </div>
                <div className="space-y-1">
                  {product.services.slice(0, 2).map((service, index) => (
                    <div
                      key={index}
                      className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded"
                    >
                      {service.serviceName} ({service.platform}) x
                      {service.quantity}
                    </div>
                  ))}
                  {product.services.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{product.services.length - 2}개 더...
                    </div>
                  )}
                </div>
              </div>

              {/* 통계 */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <div className="text-gray-600">주문 수</div>
                  <div className="font-medium">{product.totalOrders}</div>
                </div>
                <div>
                  <div className="text-gray-600">매출</div>
                  <div className="font-medium">
                    ₩{(product.totalRevenue / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="grid grid-cols-4 gap-1">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  title="상품 수정"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleCopyProduct(product)}
                  className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  title="상품 복사"
                >
                  📋
                </button>
                <button
                  onClick={() =>
                    handleToggleVisibility(product.id, !product.isHidden)
                  }
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    product.isHidden
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "bg-gray-600 text-white hover:bg-gray-700"
                  }`}
                  title={product.isHidden ? "상품 표시하기" : "상품 숨기기"}
                >
                  {product.isHidden ? "👁️" : "🙈"}
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  title="상품 삭제"
                >
                  🗑️
                </button>
              </div>

              <div className="mt-2">
                <button
                  onClick={() =>
                    handleToggleActive(product.id, !product.isActive)
                  }
                  className={`w-full px-2 py-1 text-xs rounded transition-colors ${
                    product.isActive
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                  title={product.isActive ? "상품 비활성화" : "상품 활성화"}
                >
                  {product.isActive ? "⏸️ 비활성화" : "▶️ 활성화"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <p className="text-gray-600 mb-4">등록된 상품이 없습니다</p>
          <button
            onClick={handleCreateProduct}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            첫 번째 상품 추가하기
          </button>
        </div>
      )}

      {/* 상품 관리 모달 */}
      {showModal && (
        <ProductModal
          isOpen={showModal}
          product={selectedProduct}
          mode={modalMode}
          services={services}
          onSave={handleSaveProduct}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// 상품 모달 컴포넌트
interface ProductModalProps {
  isOpen: boolean;
  product: ProductData | null;
  mode: "create" | "edit" | "view";
  services: ServiceData[];
  onSave: (productData: ProductFormData) => void;
  onClose: () => void;
}

function ProductModal({
  isOpen,
  product,
  mode,
  services,
  onSave,
  onClose,
}: ProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    category: "",
    price: 0,
    originalPrice: 0,
    discount: 0,
    services: [],
    isActive: true,
    isHidden: false,
    isFeatured: false,
    totalOrders: 0,
    totalRevenue: 0,
    deliveryTime: "1-24시간",
    icon: "",
    iconId: "",
    tags: [],
  });

  useEffect(() => {
    if (product && (mode === "edit" || mode === "view")) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice || 0,
        discount: product.discount || 0,
        services: product.services,
        isActive: product.isActive,
        isHidden: product.isHidden,
        isFeatured: product.isFeatured,
        totalOrders: product.totalOrders,
        totalRevenue: product.totalRevenue,
        deliveryTime: product.deliveryTime,
        icon: product.icon || "",
        iconId: product.iconId || "",
        tags: product.tags,
      });
    }
  }, [product, mode]);

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          serviceId: "",
          serviceName: "",
          quantity: 1,
          platform: "",
        },
      ],
    }));
  };

  const handleRemoveService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const handleServiceChange = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service, i) =>
        i === index ? { ...service, [field]: value } : service,
      ),
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === "create"
              ? "새 상품 추가"
              : mode === "edit"
                ? "상품 수정"
                : "상품 상세정보"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* 본문 */}
        <div className="p-6 space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상품명 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: Instagram 프리미엄 패키지"
                disabled={mode === "view"}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={mode === "view"}
                required
              >
                <option value="">카테고리 선택</option>
                <option value="패키지">패키지</option>
                <option value="서비스">서비스</option>
                <option value="기프트">기프트</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                판매가격 *
              </label>
              <input
                type="number"
                value={formData.price}
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
                정가 (할인 표시용)
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) =>
                  handleInputChange("originalPrice", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                disabled={mode === "view"}
              />
            </div>
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상품 설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="상품에 대한 자세한 설명을 입력하세요"
              disabled={mode === "view"}
            />
          </div>

          {/* 포함된 서비스 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                포함된 서비스
              </label>
              {mode !== "view" && (
                <button
                  onClick={handleAddService}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  + 서비스 추가
                </button>
              )}
            </div>
            <div className="space-y-3">
              {formData.services.map((service, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border border-gray-200 rounded-lg"
                >
                  <select
                    value={service.serviceId}
                    onChange={(e) => {
                      const selectedService = services.find(
                        (s) => s.id === e.target.value,
                      );
                      handleServiceChange(index, "serviceId", e.target.value);
                      handleServiceChange(
                        index,
                        "serviceName",
                        selectedService?.name || "",
                      );
                      handleServiceChange(
                        index,
                        "platform",
                        selectedService?.platform || "",
                      );
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={mode === "view"}
                  >
                    <option value="">서비스 선택</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={service.quantity}
                    onChange={(e) =>
                      handleServiceChange(
                        index,
                        "quantity",
                        Number(e.target.value),
                      )
                    }
                    placeholder="수량"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    disabled={mode === "view"}
                  />
                  <input
                    type="text"
                    value={service.platform}
                    readOnly
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="플랫폼"
                  />
                  {mode !== "view" && (
                    <button
                      onClick={() => handleRemoveService(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 상태 설정 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  handleInputChange("isActive", e.target.checked)
                }
                className="mr-2"
                disabled={mode === "view"}
              />
              <span className="text-sm font-medium text-gray-700">
                상품 활성화
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  handleInputChange("isFeatured", e.target.checked)
                }
                className="mr-2"
                disabled={mode === "view"}
              />
              <span className="text-sm font-medium text-gray-700">
                추천 상품
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isHidden}
                onChange={(e) =>
                  handleInputChange("isHidden", e.target.checked)
                }
                className="mr-2"
                disabled={mode === "view"}
              />
              <span className="text-sm font-medium text-gray-700">
                상품 숨김
              </span>
            </label>
          </div>
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
              {mode === "create" ? "상품 추가" : "변경사항 저장"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
