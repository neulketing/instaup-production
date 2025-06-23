# 🩸 Phase 3: Flesh - External Integrations

## 🎯 Mission
**"외부 PG·WebSocket·Analytics·Notification 등 2차 연결고리를 붙여 실제 사용감 확보"**

Phase 2에서 구축된 핵심 비즈니스 로직 위에 외부 서비스들을 연동하여 실제 운영 가능한 시스템을 만듭니다.

---

## ✅ Phase 3 Checklist

### 🎯 Critical Success Criteria (Must Complete)
- [ ] 토스·카카오페이 실제 API 연동 및 결제 프로세스 완성
- [ ] WebSocket 실시간 주문/잔액 업데이트 시스템
- [ ] Google Analytics 4 + Mixpanel 분석 연동
- [ ] 이메일/SMS 알림 서비스 연동
- [ ] SNS 플랫폼 API 연동 (Instagram, YouTube, TikTok)

### 🔧 Payment Gateway Integration

#### Toss Payments Implementation
- [ ] **Toss Payments API 연동**
  - 결제 요청 API 구현
  - 결제 승인 처리
  - 결제 실패/취소 처리
  - 부분 취소 기능

- [ ] **Payment Webhook 구현**
  - 결제 완료 Webhook 수신
  - 잔액 자동 충전 처리
  - 결제 상태 실시간 업데이트
  - 거래 내역 자동 생성

#### KakaoPay Integration
- [ ] **카카오페이 API 연동**
  - 결제 준비/승인 API
  - QR 코드 결제 지원
  - 정기 결제 설정 (선택사항)
  - 환불 처리 시스템

### 🔧 Real-time Features Implementation

#### WebSocket System
- [ ] **실시간 주문 상태 업데이트**
  - 주문 생성/진행/완료 알림
  - 주문 상태 변경 실시간 반영
  - 관리자 주문 모니터링

- [ ] **실시간 잔액 업데이트**
  - 결제 완료 시 즉시 잔액 반영
  - 주문 차감 즉시 업데이트
  - 환불 처리 실시간 반영

- [ ] **실시간 알림 시스템**
  - 시스템 공지사항 Push
  - 사용자별 개인화 알림
  - 관리자 알림 (오류, 이상 거래 등)

### 🔧 Analytics & Monitoring Integration

#### Google Analytics 4
- [ ] **GA4 연동 구현**
  - 페이지 뷰 추적
  - 사용자 이벤트 분석
  - 주문 전환율 추적
  - 맞춤 이벤트 설정

#### Mixpanel Analytics
- [ ] **사용자 행동 분석**
  - 서비스 이용 패턴 분석
  - 주문 과정 Funnel 분석
  - 사용자 Cohort 분석
  - A/B 테스트 기반 구축

### 🔧 Communication & Notification

#### Email Service Integration
- [ ] **이메일 서비스 연동 (Postmark/SendGrid)**
  - 회원가입/로그인 인증 이메일
  - 주문 완료/상태 변경 알림
  - 결제/환불 영수증 발송
  - 마케팅 이메일 (선택사항)

#### SMS Notification (선택사항)
- [ ] **SMS 알림 서비스**
  - 중요 거래 SMS 알림
  - 보안 관련 SMS 인증
  - 주문 완료 SMS 알림

### 🔧 SNS Platform API Integration

#### Instagram Business API
- [ ] **Instagram API 연동**
  - 계정 정보 검증
  - 팔로워 수 실시간 확인
  - 게시물 분석 데이터
  - API 제한 관리

#### YouTube Data API
- [ ] **YouTube API 연동**
  - 채널 정보 확인
  - 구독자 수 검증
  - 조회수 데이터 수집
  - API 쿼터 관리

#### TikTok Business API (선택사항)
- [ ] **TikTok API 연동**
  - 계정 정보 확인
  - 팔로워 데이터 수집
  - 영상 분석 정보

---

## 🔧 Implementation Guide

### 1. Toss Payments Integration

#### Backend - Payment Service
```typescript
// src/services/paymentService.ts
import axios from 'axios';

export class TossPaymentService {
  private readonly API_URL = 'https://api.tosspayments.com/v1';
  private readonly SECRET_KEY = process.env.TOSS_PAY_SECRET_KEY;

  async requestPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await axios.post(`${this.API_URL}/payments`, {
        amount: paymentData.amount,
        orderId: paymentData.orderId,
        orderName: paymentData.orderName,
        customerEmail: paymentData.customerEmail,
        successUrl: `${process.env.FRONTEND_URL}/payment/success`,
        failUrl: `${process.env.FRONTEND_URL}/payment/fail`
      }, {
        headers: {
          'Authorization': `Basic ${Buffer.from(this.SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`Payment request failed: ${error.message}`);
    }
  }

  async handleWebhook(webhookData: any): Promise<void> {
    // 결제 완료 처리
    await prisma.payment.create({
      data: {
        transactionId: webhookData.paymentKey,
        amount: webhookData.totalAmount,
        status: 'COMPLETED',
        userId: webhookData.metadata.userId
      }
    });

    // 사용자 잔액 업데이트
    await prisma.user.update({
      where: { id: webhookData.metadata.userId },
      data: { balance: { increment: webhookData.totalAmount } }
    });

    // 실시간 알림
    this.socketService.emitBalanceUpdate(
      webhookData.metadata.userId,
      webhookData.totalAmount
    );
  }
}
```

#### Frontend - Payment Integration
```typescript
// src/services/payment.ts
import { loadTossPayments } from '@tosspayments/payment-sdk';

export class PaymentService {
  private tossPayments: any;

  async initialize(): Promise<void> {
    this.tossPayments = await loadTossPayments(process.env.VITE_TOSSPAY_CLIENT_KEY);
  }

  async requestPayment(amount: number, orderId: string): Promise<void> {
    await this.tossPayments.requestPayment('카드', {
      amount,
      orderId,
      orderName: `Instaup 잔액 충전 ${amount.toLocaleString()}원`,
      customerName: '사용자',
      successUrl: `${window.location.origin}/payment/success`,
      failUrl: `${window.location.origin}/payment/fail`,
    });
  }
}
```

### 2. WebSocket Real-time Implementation

#### Backend - Socket Service
```typescript
// src/services/socketService.ts
import { Server } from 'socket.io';

export class SocketService {
  private io: Server;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ['GET', 'POST']
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      socket.on('join', (userId: string) => {
        socket.join(`user_${userId}`);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  }

  emitOrderUpdate(userId: string, orderData: any): void {
    this.io.to(`user_${userId}`).emit('orderUpdate', orderData);
  }

  emitBalanceUpdate(userId: string, newBalance: number): void {
    this.io.to(`user_${userId}`).emit('balanceUpdate', { balance: newBalance });
  }

  emitSystemNotification(message: string): void {
    this.io.emit('systemNotification', { message, timestamp: Date.now() });
  }
}
```

#### Frontend - Socket Integration
```typescript
// src/hooks/useSocket.ts
import { useEffect, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { AuthContext } from '../contexts/AuthContext';

export const useSocket = () => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.VITE_BACKEND_API_URL);

      newSocket.emit('join', user.id);

      newSocket.on('orderUpdate', (orderData) => {
        // 주문 상태 업데이트 처리
        toast.success(`주문 상태가 ${orderData.status}로 변경되었습니다.`);
      });

      newSocket.on('balanceUpdate', ({ balance }) => {
        // 잔액 업데이트 처리
        updateUserBalance(balance);
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user]);

  return socket;
};
```

### 3. Analytics Integration

#### Google Analytics 4 Setup
```typescript
// src/services/analytics.ts
import ReactGA from 'react-ga4';

export class AnalyticsService {
  initialize(): void {
    ReactGA.initialize(process.env.VITE_GA_MEASUREMENT_ID);
  }

  trackEvent(action: string, category: string, label?: string): void {
    ReactGA.event({
      action,
      category,
      label
    });
  }

  trackPurchase(transactionId: string, value: number): void {
    ReactGA.event('purchase', {
      transaction_id: transactionId,
      value,
      currency: 'KRW'
    });
  }

  trackOrderCreated(orderId: string, serviceType: string, amount: number): void {
    this.trackEvent('order_created', 'engagement', serviceType);
    this.trackPurchase(orderId, amount);
  }
}
```

### 4. Email Service Integration

#### Backend - Email Service
```typescript
// src/services/emailService.ts
import { Client } from 'postmark';

export class EmailService {
  private client: Client;

  constructor() {
    this.client = new Client(process.env.POSTMARK_API_KEY);
  }

  async sendOrderConfirmation(email: string, orderData: any): Promise<void> {
    await this.client.sendEmailWithTemplate({
      From: 'noreply@instaup.com',
      To: email,
      TemplateAlias: 'order-confirmation',
      TemplateModel: {
        orderNumber: orderData.id,
        serviceName: orderData.service.name,
        quantity: orderData.quantity,
        totalAmount: orderData.totalAmount,
        orderDate: new Date(orderData.createdAt).toLocaleDateString('ko-KR')
      }
    });
  }

  async sendPaymentReceipt(email: string, paymentData: any): Promise<void> {
    await this.client.sendEmailWithTemplate({
      From: 'noreply@instaup.com',
      To: email,
      TemplateAlias: 'payment-receipt',
      TemplateModel: {
        transactionId: paymentData.transactionId,
        amount: paymentData.amount,
        paymentMethod: paymentData.method,
        paymentDate: new Date(paymentData.createdAt).toLocaleDateString('ko-KR')
      }
    });
  }
}
```

---

## 🧪 Testing & Verification

### Payment Integration Testing
```bash
# Test payment webhook (using ngrok for local testing)
curl -X POST https://your-ngrok-url.ngrok.io/webhook/payment \
  -H "Content-Type: application/json" \
  -d '{
    "paymentKey": "test_payment_123",
    "orderId": "order_123",
    "totalAmount": 10000,
    "status": "DONE",
    "metadata": { "userId": "user_123" }
  }'
```

### WebSocket Testing
```javascript
// Browser console test
const socket = io('http://localhost:3000');
socket.emit('join', 'user_123');
socket.on('orderUpdate', (data) => console.log('Order update:', data));
socket.on('balanceUpdate', (data) => console.log('Balance update:', data));
```

### Analytics Verification
- [ ] Google Analytics 실시간 데이터 확인
- [ ] Mixpanel 이벤트 추적 확인
- [ ] 주문 전환 Funnel 데이터 검증

---

## 📊 Phase 3 Success Metrics

| Feature | Target | Verification Method |
|---------|--------|-------------------|
| Payment Success Rate | > 95% | Payment logs analysis |
| Real-time Message Delivery | < 1s | WebSocket latency monitoring |
| Analytics Data Accuracy | > 99% | Cross-platform verification |
| Email Delivery Rate | > 98% | Email service metrics |
| API Integration Uptime | > 99.5% | External API monitoring |

---

## 🎉 Phase 3 완료 기준

**다음 조건들이 모두 만족되면 Phase 4로 진행:**

1. ✅ 실제 결제가 처리되고 잔액이 자동으로 충전됨
2. ✅ 주문 상태 변경이 실시간으로 사용자에게 전달됨
3. ✅ 모든 사용자 행동이 Analytics에 정확히 기록됨
4. ✅ 이메일 알림이 적절한 타이밍에 발송됨
5. ✅ 외부 API 연동이 안정적으로 작동함

---

## 🔄 Next Steps (Phase 4 Preview)

Phase 3이 완료되면 다음 작업들을 준비하세요:
- E2E 테스트 스위트 구현
- 성능 최적화 및 모니터링
- 보안 강화 및 감사
- 프로덕션 배포 최적화

---

*Phase 3 Implementation Guide - Last Updated: 2025-06-20*
