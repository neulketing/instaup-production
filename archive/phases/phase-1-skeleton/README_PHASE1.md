# 🦴 Phase 1: Skeleton - Infrastructure Foundation

## 🎯 Mission
**"기초 뼈대만 세우고, 서로 의존하지 않도록 더미·Mock로 우선 통신"**

이 단계에서는 Frontend와 Backend가 기본적으로 연결되고, 데이터베이스가 설정되며, 기본적인 CI/CD 파이프라인이 구축됩니다.

---

## ✅ Phase 1 Checklist

### 🎯 Critical Success Criteria (Must Complete)
- [ ] Backend Railway 배포 & Health Check 엔드포인트 작동
- [ ] Supabase PostgreSQL 연결 & Prisma 마이그레이션 완료
- [ ] Frontend → Backend `/health` 및 `/version` 엔드포인트 통신 성공
- [ ] Environment Variables 모든 서비스에 올바르게 설정
- [ ] GitHub Actions CI/CD 파이프라인 구축

### 🔧 Technical Implementation Tasks

#### Backend Infrastructure (instaup-backend)
- [ ] **Railway 배포 설정**
  - Railway 계정 생성 및 프로젝트 생성
  - GitHub 연동 설정
  - 자동 배포 파이프라인 구성
  - Health check 엔드포인트 구현 (`GET /health`)
  - Version 엔드포인트 구현 (`GET /version`)

- [ ] **Database 연결**
  - Supabase 프로젝트 생성
  - PostgreSQL 인스턴스 설정
  - DATABASE_URL 환경변수 설정
  - Prisma 스키마 마이그레이션 실행
  - 기본 테스트 데이터 생성

- [ ] **Environment Setup**
  - `.env.production` 파일 구성
  - Railway에 환경변수 설정
  - CORS 설정 (Frontend URL 허용)
  - 기본 보안 설정

#### Frontend Integration (instaup-clean)
- [ ] **Backend 연결 설정**
  - `VITE_BACKEND_API_URL` 환경변수 설정
  - API Health Check 함수 구현
  - 연결 상태 모니터링 컴포넌트 생성
  - 에러 핸들링 기본 구조

- [ ] **연결 테스트**
  - Backend Health Check 호출
  - Network 연결 상태 확인
  - 기본 API 응답 검증

#### CI/CD Pipeline
- [ ] **GitHub Actions 설정**
  - Frontend 자동 배포 (Netlify)
  - Backend 자동 배포 (Railway)
  - 코드 품질 검사 (ESLint, TypeScript)
  - 기본 테스트 실행

---

## 🔧 Implementation Guide

### 1. Backend Railway 배포

```bash
# 1. Railway CLI 설치 (선택사항)
npm install -g @railway/cli

# 2. Backend 폴더로 이동
cd instaup-backend

# 3. Health check 엔드포인트 확인
# src/routes/health.ts 파일이 존재하는지 확인

# 4. Railway 배포
# GitHub 연동을 통해 자동 배포 설정
```

#### Health Check 엔드포인트 구현
```typescript
// src/routes/health.ts
import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

router.get('/version', (req, res) => {
  res.status(200).json({
    version: '1.0.0',
    phase: 'skeleton',
    build: process.env.RAILWAY_GIT_COMMIT_SHA || 'local'
  });
});

export default router;
```

### 2. Supabase Database 설정

```bash
# 1. Supabase 프로젝트 생성
# https://supabase.com에서 새 프로젝트 생성

# 2. DATABASE_URL 복사
# Settings > Database > Connection String

# 3. Prisma 마이그레이션 실행
cd instaup-backend
npx prisma db push
npx prisma generate

# 4. 기본 데이터 삽입 (선택사항)
npx prisma db seed
```

### 3. Environment Variables 설정

#### Backend (.env.production)
```bash
# Database
DATABASE_URL="postgresql://postgres:password@host:5432/postgres"

# Server
NODE_ENV="production"
PORT=3000
CORS_ORIGIN="https://your-frontend-url.netlify.app"

# JWT (temporary for Phase 1)
JWT_SECRET="temporary-secret-for-phase1"

# Health Check
HEALTH_CHECK_ENABLED=true
```

#### Frontend (.env.local)
```bash
# Backend API
VITE_BACKEND_API_URL="https://your-backend.railway.app"

# Health Check
VITE_HEALTH_CHECK_INTERVAL=30000
```

### 4. Frontend API 연결 테스트

```typescript
// src/services/healthCheck.ts
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

// src/components/ServerStatusMonitor.tsx 업데이트
// 기존 컴포넌트를 실제 backend health check으로 변경
```

---

## 🧪 Testing & Verification

### Manual Testing Checklist
- [ ] Backend Railway URL에 직접 접속하여 `/health` 엔드포인트 확인
- [ ] Frontend에서 Server Status가 "Connected"로 표시되는지 확인
- [ ] Database 연결 상태 확인 (Prisma Studio 사용)
- [ ] Environment variables가 올바르게 설정되었는지 확인

### Automated Tests
```bash
# Backend health check test
curl https://your-backend.railway.app/health

# Frontend build test
cd instaup-clean
npm run build

# Database connection test
cd instaup-backend
npx prisma db push --preview-feature
```

---

## 🚨 Common Issues & Solutions

### 1. CORS 에러
```
Access to fetch at 'backend-url' from origin 'frontend-url' has been blocked by CORS policy
```
**해결**: Backend의 CORS 설정에서 Frontend URL을 허용리스트에 추가

### 2. Database 연결 실패
```
Error: Can't reach database server
```
**해결**: DATABASE_URL 형식 확인, Supabase 방화벽 설정 확인

### 3. Environment Variables 미적용
```
undefined environment variable
```
**해결**: Railway/Netlify에서 환경변수 설정 재확인

---

## 📊 Phase 1 Success Metrics

| Metric | Target | Verification Method |
|--------|--------|-------------------|
| Backend Uptime | > 99% | Railway monitoring |
| Database Connection | Success | Prisma query test |
| Frontend-Backend Ping | < 500ms | Network tab 확인 |
| Health Check Success Rate | 100% | Frontend status monitor |

---

## 🎉 Phase 1 완료 기준

**다음 조건들이 모두 만족되면 Phase 2로 진행:**

1. ✅ Backend가 Railway에 성공적으로 배포되고 `/health` 엔드포인트가 200 응답
2. ✅ Supabase Database가 연결되고 Prisma 마이그레이션이 완료
3. ✅ Frontend의 Server Status Monitor가 "Connected" 상태 표시
4. ✅ 모든 environment variables가 올바르게 설정됨
5. ✅ GitHub Actions 워크플로우가 성공적으로 실행됨

---

## 🔄 Next Steps (Phase 2 Preview)

Phase 1이 완료되면 다음 작업들을 준비하세요:
- JWT 인증 시스템 구현
- 실제 API 엔드포인트 연결
- Order 및 Service CRUD 기능
- Admin Dashboard API

---

*Phase 1 Setup Guide - Last Updated: 2025-06-20*
