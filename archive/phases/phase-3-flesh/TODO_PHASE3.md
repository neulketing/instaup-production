# 🩸 Phase 3: Flesh - External Integrations TODO

## 📊 Phase 3 Progress: 0% Started (Blocked by Phase 2)

**Mission**: 외부 PG·WebSocket·Analytics·Notification 등 2차 연결고리를 붙여 실제 사용감 확보

**Prerequisites**: Phase 2 완료 (Core APIs 구현, Mock 데이터 제거, 실제 비즈니스 로직 작동)

---

## 🟡 P2 Medium Priority External Integrations

| Status | Priority | Category | Task | Reference | Estimate |
|--------|----------|----------|------|-----------|----------|
| ❌ | P2 | #payment #integration | 결제 API 실제 연동 (토스, 카카오페이) | paymentService.ts | 6h |
| ❌ | P2 | #payment #webhook | 결제 Webhook 수신 및 잔액 업데이트 로직 | webhook/ | 3h |
| ❌ | P2 | #realtime #integration | WebSocket 실시간 시스템 - 주문 상태, 잔액 업데이트 | socketService.ts | 4h |
| ❌ | P2 | #analytics #integration | Google Analytics 4 + Mixpanel 실제 연동 | analytics.ts | 3h |
| ❌ | P2 | #notification #integration | 실시간 알림 시스템 (이메일, 푸시) | emailService.ts | 4h |
| 🔄 | P2 | #sns #integration | SNS 플랫폼 API 연동 (Instagram, YouTube, TikTok) | snsApi.ts | 5h |

---

## 🔧 Detailed Task Breakdown

### 1. 결제 시스템 실제 연동 (P2)
**Current**: 프론트엔드 결제 UI 완성, Stub 구현
**Target**: 실제 토스페이먼츠/카카오페이 API 연동

**Toss Payments Subtasks**:
- [ ] 토스페이먼츠 개발자 계정 생성 및 API 키 발급
- [ ] Payment Request API 구현
- [ ] 결제 승인 처리 로직
- [ ] 결제 실패/취소 처리
- [ ] 부분 취소 기능 구현
- [ ] Payment SDK Frontend 연동

**KakaoPay Subtasks**:
- [ ] 카카오페이 개발자 계정 및 CID 발급
- [ ] 결제 준비/승인 API 구현
- [ ] QR 코드 결제 지원
- [ ] 환불 처리 시스템
- [ ] Frontend 카카오페이 SDK 연동

**Expected Outcome**: 실제 결제 처리 및 잔액 충전 작동

---

### 2. 결제 Webhook 시스템 (P2)
**Current**: Webhook 엔드포인트 없음
**Target**: 안전한 결제 완료 처리 시스템

**Backend Subtasks**:
- [ ] POST /webhook/payment/toss - 토스 Webhook 수신
- [ ] POST /webhook/payment/kakao - 카카오 Webhook 수신
- [ ] Webhook 서명 검증 로직
- [ ] 중복 처리 방지 (idempotency)
- [ ] 결제 완료 시 잔액 자동 충전
- [ ] 거래 내역 자동 생성
- [ ] 실패 시 재시도 메커니즘

**Security Subtasks**:
- [ ] Webhook URL 보안 설정
- [ ] IP 화이트리스트 설정
- [ ] Request 암호화 검증

**Expected Outcome**: 결제 완료 시 자동으로 잔액 충전 및 알림

---

### 3. WebSocket 실시간 시스템 (P2)
**Current**: 코드 구현됨, 실제 연동 미완료
**Target**: 완전한 실시간 업데이트 시스템

**Backend Subtasks**:
- [ ] Socket.io 서버 설정 및 CORS 구성
- [ ] User 별 Room 관리 시스템
- [ ] 주문 상태 변경 실시간 Push
- [ ] 잔액 업데이트 실시간 Push
- [ ] 시스템 공지사항 Push
- [ ] Connection 관리 및 재연결 로직

**Frontend Subtasks**:
- [ ] useSocket Hook 실제 연동
- [ ] 주문 상태 실시간 업데이트 UI
- [ ] 잔액 변경 즉시 반영
- [ ] 시스템 알림 Toast 표시
- [ ] 연결 상태 표시 및 재연결

**Expected Outcome**: 주문/결제 시 실시간으로 상태 업데이트

---

### 4. Analytics 연동 (P2)
**Current**: Analytics Service 구조만 존재
**Target**: 완전한 사용자 행동 분석 시스템

**Google Analytics 4 Subtasks**:
- [ ] GA4 계정 생성 및 측정 ID 발급
- [ ] React GA4 SDK 연동
- [ ] 페이지 뷰 추적 설정
- [ ] 사용자 이벤트 추적 (가입, 로그인, 주문)
- [ ] 전환 목표 설정 (주문 완료, 결제 완료)
- [ ] Enhanced Ecommerce 추적

**Mixpanel Subtasks**:
- [ ] Mixpanel 프로젝트 생성 및 토큰 발급
- [ ] 사용자 행동 이벤트 정의
- [ ] 주문 Funnel 분석 설정
- [ ] 사용자 Cohort 분석 구성
- [ ] Custom Property 추적 설정

**Expected Outcome**: 사용자 행동 및 비즈니스 메트릭 실시간 추적

---

### 5. 알림 시스템 연동 (P2)
**Current**: 알림 UI만 존재
**Target**: 실제 이메일/푸시 알림 발송

**Email Service Subtasks**:
- [ ] Postmark/SendGrid 계정 생성 및 API 키
- [ ] 이메일 템플릿 생성 (회원가입, 주문완료, 결제완료)
- [ ] 회원가입 인증 이메일 발송
- [ ] 주문 상태 변경 알림 이메일
- [ ] 결제 영수증 이메일 발송
- [ ] 마케팅 이메일 발송 (선택사항)

**Push Notification Subtasks** (선택사항):
- [ ] Firebase Cloud Messaging 설정
- [ ] 브라우저 Push 알림 권한 요청
- [ ] 중요 거래 Push 알림
- [ ] 시스템 공지 Push 알림

**Expected Outcome**: 주요 이벤트 시 자동 알림 발송

---

### 6. SNS 플랫폼 API 연동 (P2)
**Current**: Mock 데이터 사용
**Target**: 실제 SNS API로 계정 검증

**Instagram Business API Subtasks**:
- [ ] Instagram Developer 계정 생성
- [ ] Basic Display API 연동
- [ ] 계정 정보 검증 API
- [ ] 팔로워 수 실시간 확인
- [ ] API 제한 관리 및 에러 처리

**YouTube Data API Subtasks**:
- [ ] Google Cloud Console 프로젝트 생성
- [ ] YouTube Data API v3 활성화
- [ ] 채널 정보 확인 API
- [ ] 구독자 수 검증
- [ ] API 쿼터 관리

**TikTok Business API Subtasks** (선택사항):
- [ ] TikTok for Business 계정 생성
- [ ] API 접근 권한 신청
- [ ] 계정 정보 확인 API
- [ ] 팔로워 데이터 수집

**Expected Outcome**: 실제 SNS 계정 검증 및 데이터 수집

---

## 🧪 Phase 3 Verification Checklist

**완료 기준 - 다음 모든 항목이 체크되어야 Phase 4 진행 가능:**

- [ ] **Real Payment**: 실제 결제가 처리되고 잔액 자동 충전
- [ ] **Real-time Updates**: 주문/잔액 변경이 실시간으로 반영
- [ ] **Analytics Tracking**: 모든 사용자 행동이 GA4/Mixpanel에 기록
- [ ] **Email Notifications**: 주요 이벤트 시 이메일 자동 발송
- [ ] **SNS Integration**: 실제 SNS 계정 검증 작동
- [ ] **Webhook Security**: 결제 Webhook가 안전하게 처리

---

## 🔧 Environment Variables for Phase 3

### Backend (.env.production) 추가
```bash
# Payment - Toss
TOSS_PAY_CLIENT_KEY=live_ck_실제키
TOSS_PAY_SECRET_KEY=live_sk_실제키

# Payment - KakaoPay
KAKAO_PAY_CID=실제CID
KAKAO_PAY_SECRET_KEY=실제시크릿키

# Email Service
POSTMARK_API_KEY=실제키
EMAIL_FROM=noreply@instaup.com

# Analytics
GA_MEASUREMENT_ID=G-실제키
MIXPANEL_TOKEN=실제토큰

# SNS APIs
INSTAGRAM_CLIENT_ID=실제키
INSTAGRAM_CLIENT_SECRET=실제키
YOUTUBE_API_KEY=실제키
TIKTOK_CLIENT_KEY=실제키

# WebSocket
SOCKET_CORS_ORIGIN=https://same-4001w3tt33q-latest.netlify.app
```

### Frontend (.env.local) 추가
```bash
# Payment
VITE_TOSSPAY_CLIENT_KEY=live_ck_실제키
VITE_KAKAOPAY_ADMIN_KEY=실제키

# Analytics
VITE_GA_MEASUREMENT_ID=G-실제키
VITE_MIXPANEL_TOKEN=실제토큰

# Push Notifications (선택사항)
VITE_FIREBASE_VAPID_KEY=실제키
```

---

## 🧪 Phase 3 Testing Strategy

### Payment Integration Testing
```bash
# 결제 Webhook 테스트 (ngrok 사용)
curl -X POST https://your-ngrok-url.ngrok.io/webhook/payment/toss \
  -H "Content-Type: application/json" \
  -d '{
    "paymentKey": "test_payment_123",
    "orderId": "order_123",
    "totalAmount": 10000,
    "status": "DONE"
  }'
```

### WebSocket Testing
```javascript
// 브라우저 콘솔에서 테스트
const socket = io('https://your-backend.railway.app');
socket.emit('join', 'user_123');
socket.on('orderUpdate', (data) => console.log('Order:', data));
socket.on('balanceUpdate', (data) => console.log('Balance:', data));
```

### Analytics Verification
- [ ] GA4 실시간 리포트에서 이벤트 확인
- [ ] Mixpanel Live View에서 이벤트 추적 확인
- [ ] 주문 전환 Funnel 데이터 검증

---

## 📊 External API Integration Status

### Payment APIs
- [ ] Toss Payments - 결제 요청/승인
- [ ] KakaoPay - 결제 준비/승인
- [ ] Webhook - 결제 완료 처리

### Analytics APIs
- [ ] Google Analytics 4 - 이벤트 추적
- [ ] Mixpanel - 사용자 행동 분석

### Communication APIs
- [ ] Postmark/SendGrid - 이메일 발송
- [ ] Firebase FCM - Push 알림 (선택사항)

### SNS Platform APIs
- [ ] Instagram Basic Display API - 계정 검증
- [ ] YouTube Data API v3 - 채널 정보
- [ ] TikTok Business API - 계정 정보 (선택사항)

---

## 📈 Phase 3 Success Metrics

| Feature | Target | Current | Status |
|---------|--------|---------|--------|
| Payment Success Rate | > 95% | 0% | ❌ |
| Real-time Message Delivery | < 1s | N/A | ❌ |
| Analytics Data Accuracy | > 99% | 0% | ❌ |
| Email Delivery Rate | > 98% | 0% | ❌ |
| SNS API Integration | 100% | 0% | ❌ |

---

## 🔄 Next Phase Preview

**Phase 3 완료 후 Phase 4에서 할 일:**
- E2E 테스트 스위트 구현 (Playwright)
- 성능 최적화 및 모니터링 (Sentry)
- 보안 강화 (Rate limiting, Helmet)
- 다국어 지원 (i18n)
- 프로덕션 배포 최적화

---

## 🚨 Phase 3 Critical Dependencies

### External Service Accounts Required
- [ ] 토스페이먼츠 개발자 계정
- [ ] 카카오페이 개발자 계정
- [ ] Google Analytics 4 계정
- [ ] Mixpanel 계정
- [ ] Postmark/SendGrid 계정
- [ ] Instagram Developer 계정
- [ ] Google Cloud Console (YouTube API)

### API Keys & Secrets Management
- [ ] 모든 API 키를 안전하게 저장 (Railway/Netlify)
- [ ] 개발/프로덕션 환경 분리
- [ ] 키 로테이션 계획 수립

---

*Phase 3 TODO - Last Updated: 2025-06-20*
*Next Review: After Phase 2 core logic completion*
