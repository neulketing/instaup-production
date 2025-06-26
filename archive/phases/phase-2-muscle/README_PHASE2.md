# 💪 Phase 2: Muscle - Core Business Logic

## 🎯 Mission
**"핵심 로직을 각 모듈에 단단히 이식하지만, 외부 API·실시간 기능은 아직 Stub"**

Phase 1에서 구축된 인프라 위에 실제 비즈니스 로직을 구현합니다. 외부 연동은 Mock/Stub으로 처리하고, 핵심 CRUD 및 인증 기능에 집중합니다.

---

## ✅ Phase 2 Checklist

### 🎯 Critical Success Criteria (Must Complete)
- [ ] JWT 기반 사용자 인증 시스템 완성
- [ ] Service CRUD API 완전 구현
- [ ] Order 처리 시스템 (생성/업데이트/상태관리)
- [ ] Admin Dashboard API (통계/관리 기능)
- [ ] Frontend ↔ Backend 실제 API 연결 (Mock 데이터 제거)
- [ ] 사용자 Balance 관리 시스템

### 🔧 Backend Core Logic Implementation

#### Authentication System
- [ ] **JWT 인증 미들웨어 구현**
  - Token 생성/검증 로직
  - 로그인/회원가입 API
  - Password 해싱 (bcrypt)
  - Refresh Token 메커니즘

- [ ] **User Management API**
  - 사용자 프로필 CRUD
  - 비밀번호 변경
  - 계정 활성화/비활성화
  - 사용자 권한 관리

#### Service Management
- [ ] **Service CRUD API 완성**
  - Instagram/YouTube/TikTok 서비스 관리
  - 가격 계산 로직
  - 카테고리별 서비스 분류
  - 서비스 활성화/비활성화

- [ ] **Service Configuration**
  - 최소/최대 주문 수량 설정
  - 가격 계산 알고리즘
  - 할인 정책 적용

#### Order Processing System
- [ ] **Order API 완성**
  - 주문 생성/조회/수정/취소
  - 주문 상태 관리 (PENDING → PROCESSING → COMPLETED)
  - 주문 검증 로직
  - 주문 히스토리 관리

- [ ] **Balance Management**
  - 사용자 잔액 충전 시스템
  - 주문 시 잔액 차감
  - 잔액 내역 관리
  - 환불 처리 로직

#### Admin Dashboard API
- [ ] **Dashboard Metrics**
  - 실시간 통계 API
  - 매출 분석 데이터
  - 사용자 활동 통계
  - 인기 서비스 분석

- [ ] **Admin Management**
  - 관리자 로그인/권한
  - 사용자 관리 API
  - 주문 관리 및 모니터링
  - 시스템 설정 관리

### 🔧 Frontend Core Integration

#### Authentication Flow
- [ ] **실제 로그인/회원가입 연결**
  - Mock 데이터 제거
  - JWT Token 저장/관리
  - 자동 로그인 구현
  - 로그아웃 처리

- [ ] **Protected Routes**
  - 인증 필요 페이지 보호
  - 권한별 접근 제어
  - Redirect 로직 구현

#### Service & Order Integration
- [ ] **실제 서비스 데이터 연결**
  - Backend Service API 연동
  - 실시간 가격 계산
  - 서비스 카테고리 표시

- [ ] **주문 프로세스 구현**
  - 실제 주문 생성 API 연결
  - 주문 상태 실시간 업데이트
  - 주문 내역 관리

#### User Dashboard
- [ ] **사용자 대시보드 구현**
  - 실제 잔액 표시
  - 주문 내역 연동
  - 프로필 관리 기능

#### Admin Panel Integration
- [ ] **관리자 패널 API 연결**
  - 실제 통계 데이터 표시
  - 사용자 관리 기능
  - 주문 관리 인터페이스

---

## 🔧 Implementation Guide

### 1. JWT Authentication Implementation

#### Backend - Auth Service
```typescript
// src/services/authService.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthService {
  async generateToken(userId: string): Promise<string> {
    return jwt.sign(
      { userId, timestamp: Date.now() },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
  }

  async verifyToken(token: string): Promise<any> {
    return jwt.verify(token, process.env.JWT_SECRET!);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
```

#### Frontend - Auth Context Update
```typescript
// src/contexts/AuthContext.tsx - Update to use real API
const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;

    localStorage.setItem('token', token);
    setUser(user);
    setIsAuthenticated(true);

    // Remove mock implementation
  } catch (error) {
    throw new Error('Login failed');
  }
};
```

### 2. Service Management API

#### Backend - Service Controller
```typescript
// src/controllers/serviceController.ts
export class ServiceController {
  async getAllServices(req: Request, res: Response) {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      include: { category: true }
    });
    res.json(services);
  }

  async calculatePrice(req: Request, res: Response) {
    const { serviceId, quantity } = req.body;
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    const totalPrice = service.pricePerUnit * quantity;
    res.json({ totalPrice, pricePerUnit: service.pricePerUnit });
  }
}
```

### 3. Order Processing System

#### Backend - Order Service
```typescript
// src/services/orderService.ts
export class OrderService {
  async createOrder(userId: string, orderData: CreateOrderDto) {
    return await prisma.$transaction(async (tx) => {
      // 1. Check user balance
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (user.balance < orderData.totalPrice) {
        throw new Error('Insufficient balance');
      }

      // 2. Create order
      const order = await tx.order.create({
        data: {
          ...orderData,
          userId,
          status: 'PENDING'
        }
      });

      // 3. Deduct balance
      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: orderData.totalPrice } }
      });

      return order;
    });
  }
}
```

### 4. Frontend Service Integration

#### Remove Mock Data
```typescript
// src/services/backendApi.ts - Update all mock implementations
export class BackendApiService {
  async getServices(): Promise<Service[]> {
    // Remove: return mockServices;
    const response = await this.apiCall('/services');
    return response.data;
  }

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    // Remove: return mockOrder;
    const response = await this.apiCall('/orders', 'POST', orderData);
    return response.data;
  }

  async getUserBalance(): Promise<number> {
    // Remove: return mockBalance;
    const response = await this.apiCall('/user/balance');
    return response.data.balance;
  }
}
```

---

## 🧪 Testing & Verification

### Backend API Testing
```bash
# Test authentication
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test protected route
curl -X GET http://localhost:3000/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test order creation
curl -X POST http://localhost:3000/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"serviceId":"1","quantity":100,"targetUrl":"https://instagram.com/test"}'
```

### Frontend Integration Testing
- [ ] 로그인 후 JWT 토큰이 localStorage에 저장되는지 확인
- [ ] 보호된 페이지에 인증 없이 접근 시 로그인 페이지로 리다이렉트
- [ ] 실제 서비스 데이터가 표시되는지 확인
- [ ] 주문 생성 시 실제 API 호출 확인
- [ ] 관리자 대시보드 실제 데이터 표시 확인

---

## 🚨 Phase 2 Stub Implementation

### Payment Integration (Stub)
```typescript
// src/services/paymentService.ts - Stub implementation
export class PaymentService {
  async processPayment(amount: number, method: string): Promise<PaymentResult> {
    // Stub: Always return success for Phase 2
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay

    return {
      success: true,
      transactionId: `stub_${Date.now()}`,
      amount,
      method
    };
  }
}
```

### WebSocket Service (Stub)
```typescript
// src/services/socketService.ts - Stub implementation
export class SocketService {
  emitOrderUpdate(orderId: string, status: string): void {
    // Stub: Log only, no real-time updates yet
    console.log(`[STUB] Order ${orderId} status updated to ${status}`);
  }
}
```

---

## 📊 Phase 2 Success Metrics

| Feature | Target | Verification Method |
|---------|--------|-------------------|
| API Response Time | < 200ms | Backend logs |
| Authentication Success | > 95% | Login analytics |
| Order Processing Success | > 90% | Order completion rate |
| Frontend API Integration | 100% | Remove all mock data |
| Database Query Performance | < 100ms | Query optimization |

---

## 🎉 Phase 2 완료 기준

**다음 조건들이 모두 만족되면 Phase 3로 진행:**

1. ✅ 모든 mock 데이터가 실제 API 호출로 대체됨
2. ✅ JWT 인증이 완전히 작동하고 보호된 라우트 접근 제어
3. ✅ 사용자가 실제로 주문을 생성하고 잔액이 차감됨
4. ✅ 관리자 대시보드에서 실제 통계 데이터 표시
5. ✅ 모든 CRUD 작업이 데이터베이스에 정확히 반영됨

---

## 🔄 Next Steps (Phase 3 Preview)

Phase 2가 완료되면 다음 작업들을 준비하세요:
- 실제 결제 게이트웨이 연동 (토스, 카카오페이)
- WebSocket 실시간 기능 구현
- 외부 SNS API 연동
- Analytics 및 모니터링 도구 연결

---

*Phase 2 Implementation Guide - Last Updated: 2025-06-20*
