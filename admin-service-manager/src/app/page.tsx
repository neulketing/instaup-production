'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Package,
  Activity,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Settings,
  BarChart3,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { mockDashboardStats, mockServiceTypes, mockProducts, mockDetailedServices, mockConnectionOptions } from '@/data/mockData';
import type { ServiceType, Product, DetailedService, ConnectionOption } from '@/types';
import ServiceTypeDialog from '@/components/ServiceTypeDialog';
import ProductDialog from '@/components/ProductDialog';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>(mockServiceTypes);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [detailedServices, setDetailedServices] = useState<DetailedService[]>(mockDetailedServices);
  const [connectionOptions, setConnectionOptions] = useState<ConnectionOption[]>(mockConnectionOptions);

  // 다이얼로그 상태
  const [serviceTypeDialog, setServiceTypeDialog] = useState({
    open: false,
    serviceType: null as ServiceType | null
  });

  const [productDialog, setProductDialog] = useState({
    open: false,
    product: null as Product | null
  });

  const stats = mockDashboardStats;

  // 서비스 유형 관련 함수들
  const handleSaveServiceType = async (serviceTypeData: Omit<ServiceType, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();

    if (serviceTypeDialog.serviceType) {
      // 수정
      const updated = {
        ...serviceTypeData,
        id: serviceTypeDialog.serviceType.id,
        createdAt: serviceTypeDialog.serviceType.createdAt,
        updatedAt: now
      };
      setServiceTypes(prev => prev.map(st => st.id === updated.id ? updated : st));
    } else {
      // 추가
      const newServiceType: ServiceType = {
        ...serviceTypeData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now
      };
      setServiceTypes(prev => [...prev, newServiceType]);
    }
  };

  const handleEditServiceType = (serviceType: ServiceType) => {
    setServiceTypeDialog({
      open: true,
      serviceType
    });
  };

  const handleDeleteServiceType = (id: string) => {
    if (confirm('정말로 이 서비스 유형을 삭제하시겠습니까?')) {
      setServiceTypes(prev => prev.filter(st => st.id !== id));
    }
  };

  // 상품 관련 함수들
  const handleSaveProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();

    if (productDialog.product) {
      // 수정
      const updated = {
        ...productData,
        id: productDialog.product.id,
        createdAt: productDialog.product.createdAt,
        updatedAt: now
      };
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    } else {
      // 추가
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now
      };
      setProducts(prev => [...prev, newProduct]);
    }
  };

  const handleEditProduct = (product: Product) => {
    setProductDialog({
      open: true,
      product
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">서비스 관리자</h1>
              <p className="text-sm text-gray-600">서비스와 상품을 관리하세요</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                관리자
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                설정
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 사이드바 */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('dashboard')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                대시보드
              </Button>
              <Button
                variant={activeTab === 'services' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('services')}
              >
                <Activity className="h-4 w-4 mr-2" />
                서비스 관리
              </Button>
              <Button
                variant={activeTab === 'products' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('products')}
              >
                <Package className="h-4 w-4 mr-2" />
                상품 관리
              </Button>
              <Button
                variant={activeTab === 'connections' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('connections')}
              >
                <Users className="h-4 w-4 mr-2" />
                연결 관리
              </Button>
            </div>
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* 통계 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">총 서비스</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{serviceTypes.length}</div>
                    <p className="text-xs text-muted-foreground">
                      활성 서비스: {serviceTypes.filter(s => s.isActive).length}개
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">총 상품</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{products.length}</div>
                    <p className="text-xs text-muted-foreground">
                      등록된 상품 수
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">총 매출</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ₩{stats.totalRevenue.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      이번 달 누적
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">월간 성장률</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      +{stats.monthlyGrowth}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      전월 대비
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* 최근 활동 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>인기 서비스</CardTitle>
                    <CardDescription>현재 활성화된 서비스 목록</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {serviceTypes.filter(service => service.isActive).map(service => (
                        <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{service.name}</h4>
                            <p className="text-sm text-gray-600">{service.description}</p>
                          </div>
                          <Badge variant="secondary">활성</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>인기 상품</CardTitle>
                    <CardDescription>현재 인기있는 상품들</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {products.filter(product => product.isPopular).map(product => (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-gray-600">₩{product.price.toLocaleString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="default">인기</Badge>
                            <Badge variant="outline">{product.category}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">서비스 관리</h2>
                  <p className="text-gray-600">서비스 유형과 세부 서비스를 관리하세요</p>
                </div>
                <Button onClick={() => setServiceTypeDialog({ open: true, serviceType: null })}>
                  <Plus className="h-4 w-4 mr-2" />
                  새 서비스 추가
                </Button>
              </div>

              <Tabs defaultValue="types" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="types">서비스 유형</TabsTrigger>
                  <TabsTrigger value="detailed">세부 서비스</TabsTrigger>
                </TabsList>

                <TabsContent value="types" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>서비스 유형 목록</CardTitle>
                      <CardDescription>플랫폼별 서비스 유형을 관리합니다</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {serviceTypes.map(service => (
                          <Card key={service.id} className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold">{service.name}</h3>
                              <Badge variant={service.isActive ? "default" : "secondary"}>
                                {service.isActive ? "활성" : "비활성"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditServiceType(service)}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                수정
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteServiceType(service.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                삭제
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="detailed" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>세부 서비스 목록</CardTitle>
                      <CardDescription>각 플랫폼의 세부 서비스를 관리합니다</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {serviceTypes.map(serviceType => (
                          <div key={serviceType.id}>
                            <h3 className="font-semibold text-lg mb-3">{serviceType.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                              {detailedServices
                                .filter(ds => ds.serviceTypeId === serviceType.id)
                                .map(detailedService => (
                                  <Card key={detailedService.id} className="p-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-medium">{detailedService.name}</h4>
                                      <Badge variant={detailedService.isActive ? "default" : "secondary"}>
                                        {detailedService.isActive ? "활성" : "비활성"}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600">{detailedService.description}</p>
                                  </Card>
                                ))
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">상품 관리</h2>
                  <p className="text-gray-600">구매 가능한 상품들을 관리하세요</p>
                </div>
                <Button onClick={() => setProductDialog({ open: true, product: null })}>
                  <Plus className="h-4 w-4 mr-2" />
                  새 상품 추가
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>상품 목록</CardTitle>
                  <CardDescription>등록된 모든 상품을 확인하고 관리합니다</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.map(product => (
                      <Card key={product.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{product.name}</h3>
                              <div className="flex gap-2">
                                {product.isPopular && <Badge variant="default">인기</Badge>}
                                <Badge variant="outline">{product.category}</Badge>
                                <Badge variant={product.isActive ? "default" : "secondary"}>
                                  {product.isActive ? "판매중" : "중단"}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>가격: ₩{product.price.toLocaleString()}</span>
                              <span>배송: {product.deliveryTime}</span>
                              <span>수량: {product.minQuantity}-{product.maxQuantity}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              수정
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              삭제
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">연결 관리</h2>
                  <p className="text-gray-600">서비스 연결 옵션을 관리하세요</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  새 연결 추가
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>연결 옵션 목록</CardTitle>
                  <CardDescription>각 서비스의 연결 방법을 관리합니다</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceTypes.map(serviceType => (
                      <div key={serviceType.id}>
                        <h3 className="font-semibold text-lg mb-3">{serviceType.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                          {connectionOptions
                            .filter(co => co.serviceTypeId === serviceType.id)
                            .map(connectionOption => (
                              <Card key={connectionOption.id} className="p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">{connectionOption.name}</h4>
                                  <Badge variant={connectionOption.isActive ? "default" : "secondary"}>
                                    {connectionOption.isActive ? "활성" : "비활성"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{connectionOption.description}</p>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-3 w-3 mr-1" />
                                    수정
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    삭제
                                  </Button>
                                </div>
                              </Card>
                            ))
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* 다이얼로그들 */}
      <ServiceTypeDialog
        open={serviceTypeDialog.open}
        onOpenChange={(open) => setServiceTypeDialog({ open, serviceType: null })}
        serviceType={serviceTypeDialog.serviceType}
        onSave={handleSaveServiceType}
      />

      <ProductDialog
        open={productDialog.open}
        onOpenChange={(open) => setProductDialog({ open, product: null })}
        product={productDialog.product}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
