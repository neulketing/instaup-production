# 🦴 Phase 1: Skeleton - Infrastructure TODO

## 📊 Phase 1 Progress: 0% Started

**Mission**: 기초 뼈대만 세우고, 서로 의존하지 않도록 더미·Mock로 우선 통신

---

## 🔥 P0 Critical Infrastructure Tasks

| Status | Priority | Category | Task | Reference | Estimate |
|--------|----------|----------|------|-----------|----------|
| ❌ | P0 | #deployment #backend | Backend Railway 배포 및 환경 변수 설정 | RAILWAY_DEPLOY.md | 2h |
| ❌ | P0 | #integration #backend | Database 연동 - Supabase/PostgreSQL 실제 연결 | DATABASE_URL 설정 | 1h |
| ❌ | P0 | #integration #frontend | Frontend → Backend API 기본 연결 (Health Check만) | backendApi.ts | 1h |
| ❌ | P0 | #infrastructure #cicd | GitHub Actions CI/CD 파이프라인 구축 | .github/workflows/ | 2h |

---

## 🔧 Detailed Task Breakdown

### 1. Backend Railway 배포 (P0)
**Current**: Backend 코드 완성, 미배포 상태
**Target**: Railway에 배포되고 Health Check 엔드포인트 작동

**Subtasks**:
- [ ] Railway 계정 생성 및 프로젝트 생성
- [ ] GitHub 연동 설정
- [ ] 환경 변수 설정 (NODE_ENV, PORT, JWT_SECRET)
- [ ] Health Check 엔드포인트 구현 (`GET /health`)
- [ ] Version 엔드포인트 구현 (`GET /version`)
- [ ] 배포 성공 및 URL 접근 확인

**Expected Outcome**: `https://your-backend.railway.app/health` 정상 응답

---

### 2. Database 연결 (P0)
**Current**: Prisma 스키마 완성, 실제 DB 미연결
**Target**: Supabase PostgreSQL 연결 및 테이블 생성

**Subtasks**:
- [ ] Supabase 프로젝트 생성
- [ ] PostgreSQL 인스턴스 설정
- [ ] DATABASE_URL 환경변수 설정
- [ ] `prisma db push` 실행하여 스키마 적용
- [ ] 기본 테스트 데이터 생성 (서비스 3개)
- [ ] Database 연결 테스트 수행

**Expected Outcome**: Prisma Studio에서 테이블 확인 가능

---

### 3. Frontend-Backend 기본 연결 (P0)
**Current**: Frontend는 Mock 데이터 사용
**Target**: Backend Health Check 호출 성공

**Subtasks**:
- [ ] `VITE_BACKEND_API_URL` 환경변수 설정
- [ ] Health Check API 호출 함수 구현
- [ ] ServerStatusMonitor 컴포넌트를 실제 API로 연결
- [ ] CORS 설정 확인 및 수정
- [ ] 연결 상태 확인 UI 업데이트

**Expected Outcome**: Frontend에서 "Server: Connected" 상태 표시

---

### 4. CI/CD 파이프라인 구축 (P0)
**Current**: 수동 배포 중
**Target**: GitHub Actions 자동 배포

**Subtasks**:
- [ ] Frontend Netlify 자동 배포 워크플로우
- [ ] Backend Railway 자동 배포 워크플로우
- [ ] 코드 품질 검사 (ESLint, TypeScript)
- [ ] 기본 빌드 테스트
- [ ] 배포 실패 시 알림 설정

**Expected Outcome**: Git push 시 자동 배포 실행

---

## 🧪 Phase 1 Verification Checklist

**완료 기준 - 다음 모든 항목이 체크되어야 Phase 2 진행 가능:**

- [ ] **Backend Health Check**: `curl https://your-backend.railway.app/health` 성공 응답
- [ ] **Database Connection**: Prisma Studio에서 User/Service/Order 테이블 확인
- [ ] **Frontend Connection**: Browser에서 Server Status "Connected" 표시
- [ ] **Environment Variables**: 모든 필수 환경변수 설정 완료
- [ ] **CI/CD Pipeline**: GitHub Actions 워크플로우 성공 실행

---

## 🚨 Common Issues & Solutions

### 1. Railway 배포 실패
**증상**: Build 에러 또는 Runtime 에러
**해결**:
- Node.js 버전 확인 (package.json engines 설정)
- 환경변수 누락 확인
- 포트 설정 확인 (Railway PORT 사용)

### 2. Database 연결 실패
**증상**: `Can't reach database server`
**해결**:
- DATABASE_URL 형식 확인
- Supabase IP 화이트리스트 설정
- 연결 풀 설정 확인

### 3. CORS 에러
**증상**: Frontend → Backend 요청 차단
**해결**:
- Backend CORS_ORIGIN 환경변수에 Frontend URL 추가
- Preflight OPTIONS 요청 처리 확인

---

## 📈 Phase 1 Success Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Backend Uptime | > 99% | 0% | ❌ |
| Database Connection | Success | None | ❌ |
| Frontend-Backend Ping | < 500ms | N/A | ❌ |
| Deployment Success Rate | 100% | 0% | ❌ |

---

## 🔄 Next Phase Preview

**Phase 1 완료 후 Phase 2에서 할 일:**
- JWT 인증 시스템 구현
- Mock 데이터를 실제 API로 대체
- Service/Order CRUD 기능 연결
- Admin Dashboard API 연동

---

## 📝 Environment Variables Checklist

### Backend (.env.production)
```bash
# Core
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:password@host:5432/postgres

# Security
JWT_SECRET=temporary-secret-for-phase1
CORS_ORIGIN=https://same-4001w3tt33q-latest.netlify.app

# Health Check
HEALTH_CHECK_ENABLED=true
```

### Frontend (.env.local)
```bash
# Backend API
VITE_BACKEND_API_URL=https://your-backend.railway.app

# Health Check
VITE_HEALTH_CHECK_INTERVAL=30000
```

---

*Phase 1 TODO - Last Updated: 2025-06-20*
*Next Review: After Backend deployment completion*
