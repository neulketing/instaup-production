'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { type Product, ServiceType, DetailedService, ConnectionOption } from '@/types';
import { mockServiceTypes, mockDetailedServices, mockConnectionOptions } from '@/data/mockData';
import { Plus, X } from 'lucide-react';

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export default function ProductDialog({
  open,
  onOpenChange,
  product,
  onSave
}: ProductDialogProps) {
  const [formData, setFormData] = useState({
    serviceTypeId: '',
    detailedServiceId: '',
    connectionOptionId: '',
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    currency: 'KRW',
    isActive: true,
    isPopular: false,
    stockQuantity: 0,
    minQuantity: 1,
    maxQuantity: 1,
    deliveryTime: '',
    category: '',
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const availableDetailedServices = mockDetailedServices.filter(
    service => service.serviceTypeId === formData.serviceTypeId
  );

  const availableConnectionOptions = mockConnectionOptions.filter(
    option => option.serviceTypeId === formData.serviceTypeId
  );

  useEffect(() => {
    if (product) {
      setFormData({
        serviceTypeId: product.serviceTypeId,
        detailedServiceId: product.detailedServiceId,
        connectionOptionId: product.connectionOptionId,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice || 0,
        currency: product.currency,
        isActive: product.isActive,
        isPopular: product.isPopular,
        stockQuantity: product.stockQuantity || 0,
        minQuantity: product.minQuantity,
        maxQuantity: product.maxQuantity,
        deliveryTime: product.deliveryTime,
        category: product.category,
        tags: [...product.tags]
      });
    } else {
      setFormData({
        serviceTypeId: '',
        detailedServiceId: '',
        connectionOptionId: '',
        name: '',
        description: '',
        price: 0,
        originalPrice: 0,
        currency: 'KRW',
        isActive: true,
        isPopular: false,
        stockQuantity: 0,
        minQuantity: 1,
        maxQuantity: 1,
        deliveryTime: '',
        category: '',
        tags: []
      });
    }
  }, [product]);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.description.trim() ||
        !formData.serviceTypeId || !formData.detailedServiceId ||
        !formData.connectionOptionId || formData.price <= 0) {
      alert('필수 필드를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const productData = {
        ...formData,
        options: [] // 기본값으로 빈 배열 설정
      };
      await onSave(productData);
      onOpenChange(false);
    } catch (error) {
      console.error('상품 저장 실패:', error);
      alert('상품 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleServiceTypeChange = (serviceTypeId: string) => {
    setFormData(prev => ({
      ...prev,
      serviceTypeId,
      detailedServiceId: '',
      connectionOptionId: ''
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? '상품 수정' : '새 상품 추가'}
          </DialogTitle>
          <DialogDescription>
            {product
              ? '기존 상품 정보를 수정합니다.'
              : '새로운 상품을 추가합니다.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* 서비스 선택 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">서비스 유형 *</Label>
            <Select value={formData.serviceTypeId} onValueChange={handleServiceTypeChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="서비스 유형을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {mockServiceTypes.map(service => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">세부 서비스 *</Label>
            <Select
              value={formData.detailedServiceId}
              onValueChange={(value) => handleInputChange('detailedServiceId', value)}
              disabled={!formData.serviceTypeId}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="세부 서비스를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {availableDetailedServices.map(service => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">연결 옵션 *</Label>
            <Select
              value={formData.connectionOptionId}
              onValueChange={(value) => handleInputChange('connectionOptionId', value)}
              disabled={!formData.serviceTypeId}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="연결 옵션을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {availableConnectionOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 상품 기본 정보 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">상품명 *</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="col-span-3"
              placeholder="상품명을 입력하세요"
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2">상품 설명 *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="col-span-3"
              placeholder="상품에 대한 상세 설명을 입력하세요"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">카테고리</Label>
            <Input
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="col-span-3"
              placeholder="예: 팔로워, 좋아요"
            />
          </div>

          {/* 가격 정보 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">판매 가격 *</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', Number.parseInt(e.target.value) || 0)}
              className="col-span-3"
              placeholder="0"
              min="0"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">원래 가격</Label>
            <Input
              type="number"
              value={formData.originalPrice}
              onChange={(e) => handleInputChange('originalPrice', Number.parseInt(e.target.value) || 0)}
              className="col-span-3"
              placeholder="할인 전 가격 (선택사항)"
              min="0"
            />
          </div>

          {/* 수량 정보 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">최소 수량</Label>
            <Input
              type="number"
              value={formData.minQuantity}
              onChange={(e) => handleInputChange('minQuantity', Number.parseInt(e.target.value) || 1)}
              className="col-span-3"
              min="1"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">최대 수량</Label>
            <Input
              type="number"
              value={formData.maxQuantity}
              onChange={(e) => handleInputChange('maxQuantity', Number.parseInt(e.target.value) || 1)}
              className="col-span-3"
              min="1"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">재고 수량</Label>
            <Input
              type="number"
              value={formData.stockQuantity}
              onChange={(e) => handleInputChange('stockQuantity', Number.parseInt(e.target.value) || 0)}
              className="col-span-3"
              placeholder="0 (무제한)"
              min="0"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">배송 시간</Label>
            <Input
              value={formData.deliveryTime}
              onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
              className="col-span-3"
              placeholder="예: 1-6 hours, Instant"
            />
          </div>

          {/* 태그 */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2">태그</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="태그를 입력하고 추가 버튼을 클릭하세요"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" variant="outline" size="sm" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* 상태 옵션 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">활성 상태</Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Label className="text-sm text-gray-600">
                {formData.isActive ? '판매중' : '판매중단'}
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">인기 상품</Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                checked={formData.isPopular}
                onCheckedChange={(checked) => handleInputChange('isPopular', checked)}
              />
              <Label className="text-sm text-gray-600">
                {formData.isPopular ? '인기 상품으로 표시' : '일반 상품'}
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? '저장 중...' : '저장'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
