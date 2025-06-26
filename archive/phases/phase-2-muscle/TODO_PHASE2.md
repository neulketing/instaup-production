# 💪 Phase 2: Muscle - Core Business Logic TODO

## 📊 Phase 2 Progress: 0% Started (Blocked by Phase 1)

**Mission**: 핵심 로직을 각 모듈에 단단히 이식하지만, 외부 API·실시간 기능은 아직 Stub

**Prerequisites**: Phase 1 완료 (Backend 배포, Database 연결, Basic API 통신)

---

## 🔴 P1 High Priority Core Features

| Status | Priority | Category | Task | Reference | Estimate |
|--------|----------|----------|------|-----------|----------|
| ❌ | P1 | #auth #integration | 실제 JWT 기반 인증 시스템 연동 | AuthContext.tsx | 4h |
| 🔄 | P1 | #backend #api | Service CRUD API 엔드포인트 완성 | service.ts | 3h |
| 🔄 | P1 | #backend #api | Order 처리 시스템 완성 - 상태 변환 로직 | orderService.ts | 4h |
| ❌ | P1 | #admin #backend | 관리자 대시보드 API 완성 | admin.ts | 3h |
| ⏳ | P1 | #database #migration | Prisma 마이그레이션 및 Seed 데이터 생성 | prisma/seed.ts | 2h |

---

## 🔧 Detailed Task Breakdown

### 1. JWT 인증 시스템 구현 (P1)
**Current**: LocalStorage 기반 Mock 인증
**Target**: 완전한 JWT 기반 실제 인증

**Backend Subtasks**:
- [ ] JWT Service 구현 (token 생성/검증)
- [ ] bcrypt 패스워드 해싱 구현
- [ ] Auth Middleware 완성 (토큰 검증)
- [ ] Login/Register API 엔드포인트 구현
- [ ] Refresh Token 메커니즘 구현
- [ ] Password 변경 API 구현

**Frontend Subtasks**:
- [ ] AuthContext Mock 데이터 제거
- [ ] 실제 로그인/회원가입 API 연동
- [ ] JWT Token localStorage 관리
- [ ] 자동 로그인 기능 구현
- [ ] Protected Routes 구현
- [ ] 토큰 만료 처리 로직

**Expected Outcome**: 실제 회원가입/로그인으로 서비스 이용 가능

---

### 2. Service CRUD API 완성 (P1)
**Current**: 기본 구조만 구현됨
**Target**: 완전한 서비스 관리 API

**Backend Subtasks**:
- [ ] GET /services - 활성 서비스 목록 (카테고리별)
- [ ] GET /services/:id - 서비스 상세 정보
- [ ] POST /services - 새 서비스 생성 (Admin)
- [ ] PUT /services/:id - 서비스 정보 수정 (Admin)
- [ ] DELETE /services/:id - 서비스 비활성화 (Admin)
- [ ] 가격 계산 로직 구현
- [ ] 최소/최대 수량 검증

**Frontend Subtasks**:
- [ ] ServiceList Mock 데이터 제거
- [ ] 실제 서비스 API 연동
- [ ] 동적 가격 계산 구현
- [ ] 서비스 카테고리 필터링
- [ ] Admin 서비스 관리 UI 연동

**Expected Outcome**: 실제 서비스 데이터로 주문 가능

---

### 3. Order 처리 시스템 완성 (P1)
**Current**: 기본 Order 모델만 존재
**Target**: 완전한 주문 처리 워크플로우

**Backend Subtasks**:
- [ ] POST /orders - 주문 생성 (잔액 검증)
- [ ] GET /orders - 사용자 주문 내역
- [ ] GET /orders/:id - 주문 상세 정보
- [ ] PUT /orders/:id/status - 주문 상태 변경 (Admin)
- [ ] 주문 상태 머신 구현 (PENDING → PROCESSING → COMPLETED)
- [ ] 잔액 차감 트랜잭션 구현
- [ ] 주문 검증 로직 (URL, 수량)

**Frontend Subtasks**:
- [ ] OrderModal Mock 데이터 제거
- [ ] 실제 주문 생성 API 연동
- [ ] 주문 내역 실시간 표시
- [ ] 주문 상태별 필터링
- [ ] 주문 취소 기능 구현

**Expected Outcome**: 실제 주문 생성 및 잔액 차감 작동

---

### 4. Admin Dashboard API 완성 (P1)
**Current**: UI만 구현됨
**Target**: 실제 통계 및 관리 기능

**Backend Subtasks**:
- [ ] GET /admin/dashboard - 대시보드 메트릭
- [ ] GET /admin/users - 사용자 관리
- [ ] GET /admin/orders - 주문 관리
- [ ] PUT /admin/orders/:id - 주문 상태 변경
- [ ] GET /admin/analytics - 매출/통계 데이터
- [ ] Admin 권한 검증 미들웨어

**Frontend Subtasks**:
- [ ] AdminDashboard Mock 데이터 제거
- [ ] 실제 통계 API 연동
- [ ] 사용자 관리 기능 연동
- [ ] 주문 관리 인터페이스 연동
- [ ] 실시간 대시보드 업데이트

**Expected Outcome**: 관리자가 실제 데이터로 시스템 관리 가능

---

### 5. Database Seed 데이터 생성 (P1)
**Current**: 빈 데이터베이스
**Target**: 운영 가능한 초기 데이터

**Subtasks**:
- [ ] Instagram/YouTube/TikTok 서비스 데이터 생성
- [ ] 테스트 관리자 계정 생성
- [ ] 가격 정책 데이터 설정
- [ ] 샘플 사용자 계정 생성 (개발용)
- [ ] 서비스 카테고리 데이터 생성

**Expected Outcome**: 실제 서비스로 주문 테스트 가능

---

## 🧪 Phase 2 Verification Checklist

**완료 기준 - 다음 모든 항목이 체크되어야 Phase 3 진행 가능:**

- [ ] **Authentication**: 실제 회원가입/로그인으로 서비스 접근
- [ ] **Service Management**: 실제 서비스 데이터 표시 및 가격 계산
- [ ] **Order Processing**: 주문 생성 시 실제 잔액 차감
- [ ] **Admin Dashboard**: 실제 통계/데이터 표시
- [ ] **No Mock Data**: 모든 Mock 데이터 제거 완료
- [ ] **Database Integration**: 모든 CRUD 작업이 DB에 반영

---

## 🚨 Mock Data Removal Checklist

**Phase 2에서 반드시 제거해야 할 Mock 구현들:**

### Frontend Mock Removal
- [ ] `src/services/backendApi.ts` - Mock 응답 제거
- [ ] `src/contexts/AuthContext.tsx` - Mock 로그인 제거
- [ ] `src/data/services.ts` - Mock 서비스 데이터 제거
- [ ] `src/components/AdminDashboard.tsx` - Mock 통계 제거
- [ ] `src/components/OrderModal.tsx` - Mock 주문 제거

### Backend Stub Implementation
- [ ] Payment Service - Stub 구현 (Phase 3에서 실제 연동)
- [ ] WebSocket Service - Stub 구현 (Phase 3에서 실제 연동)
- [ ] Email Service - Stub 구현 (Phase 3에서 실제 연동)

---

## 📊 API Endpoint Completion Status

### Authentication APIs
- [ ] `POST /auth/register` - 회원가입
- [ ] `POST /auth/login` - 로그인
- [ ] `POST /auth/refresh` - 토큰 갱신
- [ ] `PUT /auth/password` - 비밀번호 변경
- [ ] `GET /auth/profile` - 프로필 조회

### Service APIs
- [ ] `GET /services` - 서비스 목록
- [ ] `GET /services/:id` - 서비스 상세
- [ ] `POST /services` - 서비스 생성 (Admin)
- [ ] `PUT /services/:id` - 서비스 수정 (Admin)
- [ ] `DELETE /services/:id` - 서비스 삭제 (Admin)

### Order APIs
- [ ] `POST /orders` - 주문 생성
- [ ] `GET /orders` - 주문 내역
- [ ] `GET /orders/:id` - 주문 상세
- [ ] `PUT /orders/:id/cancel` - 주문 취소

### Admin APIs
- [ ] `GET /admin/dashboard` - 대시보드 데이터
- [ ] `GET /admin/users` - 사용자 목록
- [ ] `GET /admin/orders` - 주문 관리
- [ ] `PUT /admin/orders/:id` - 주문 상태 변경

### User APIs
- [ ] `GET /user/profile` - 프로필 조회
- [ ] `PUT /user/profile` - 프로필 수정
- [ ] `GET /user/balance` - 잔액 조회
- [ ] `GET /user/transactions` - 거래 내역

---

## 🔧 Database Schema Validation

**Phase 2에서 사용할 주요 테이블들:**

- [ ] **User** - 사용자 정보, 잔액 관리
- [ ] **Service** - 서비스 정보, 가격 정책
- [ ] **Order** - 주문 정보, 상태 관리
- [ ] **Admin** - 관리자 계정 정보
- [ ] **ServiceCategory** - 서비스 카테고리

---

## 📈 Phase 2 Success Metrics

| Feature | Target | Current | Status |
|---------|--------|---------|--------|
| API Response Time | < 200ms | N/A | ❌ |
| Authentication Success Rate | > 95% | 0% | ❌ |
| Order Processing Success | > 90% | 0% | ❌ |
| Mock Data Removal | 100% | 0% | ❌ |
| Database CRUD Operations | 100% | 0% | ❌ |

---

## 🔄 Next Phase Preview

**Phase 2 완료 후 Phase 3에서 할 일:**
- 토스/카카오페이 실제 결제 연동
- WebSocket 실시간 기능 구현
- Google Analytics/Mixpanel 연동
- 이메일 알림 서비스 연동

---

## 🧪 Testing Strategy for Phase 2

### Manual Testing
- [ ] 회원가입 → 로그인 → 주문 → 완료 전체 플로우
- [ ] 관리자 로그인 → 대시보드 → 주문 관리
- [ ] 잔액 부족 시 주문 실패 처리
- [ ] JWT 토큰 만료 처리

### API Testing
```bash
# 회원가입 테스트
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"테스트"}'

# 로그인 테스트
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 서비스 목록 조회
curl -X GET http://localhost:3000/services

# 주문 생성 (토큰 필요)
curl -X POST http://localhost:3000/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"serviceId":"1","quantity":1000,"targetUrl":"https://instagram.com/test"}'
```

---

*Phase 2 TODO - Last Updated: 2025-06-20*
*Next Review: After Phase 1 infrastructure completion*
