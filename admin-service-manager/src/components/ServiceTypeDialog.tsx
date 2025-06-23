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
import type { ServiceType } from '@/types';

interface ServiceTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceType?: ServiceType | null;
  onSave: (serviceType: Omit<ServiceType, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export default function ServiceTypeDialog({
  open,
  onOpenChange,
  serviceType,
  onSave
}: ServiceTypeDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (serviceType) {
      setFormData({
        name: serviceType.name,
        description: serviceType.description,
        icon: serviceType.icon || '',
        isActive: serviceType.isActive
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon: '',
        isActive: true
      });
    }
  }, [serviceType]);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('서비스명과 설명을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('서비스 저장 실패:', error);
      alert('서비스 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {serviceType ? '서비스 유형 수정' : '새 서비스 유형 추가'}
          </DialogTitle>
          <DialogDescription>
            {serviceType
              ? '기존 서비스 유형 정보를 수정합니다.'
              : '새로운 서비스 유형을 추가합니다.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              서비스명 *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="col-span-3"
              placeholder="예: 인스타그램"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              아이콘
            </Label>
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) => handleInputChange('icon', e.target.value)}
              className="col-span-3"
              placeholder="예: instagram"
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right mt-2">
              설명 *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="col-span-3"
              placeholder="서비스에 대한 상세 설명을 입력하세요"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isActive" className="text-right">
              활성 상태
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive" className="text-sm text-gray-600">
                {formData.isActive ? '활성' : '비활성'}
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
