# 🚂 Railway 배포 가이드 - Phase 1

## 🎯 Phase 1 목표
Backend를 Railway에 배포하여 Health Check 엔드포인트가 작동하도록 설정

---

## 📋 1단계: Railway 계정 생성 및 프로젝트 설정

### 1.1 Railway 계정 생성
1. https://railway.app 접속
2. "Start a New Project" 클릭
3. GitHub 계정으로 로그인
4. Railway와 GitHub 연동 허용

### 1.2 새 프로젝트 생성
1. "Deploy from GitHub repo" 선택
2. 현재 Instaup 레포지토리 선택
3. 프로젝트 이름: `instaup-backend`

---

## 📋 2단계: PostgreSQL 데이터베이스 추가

### 2.1 PostgreSQL 서비스 추가
1. Railway 대시보드에서 "Add Service" 클릭
2. "PostgreSQL" 선택
3. 자동으로 DATABASE_URL이 생성됨

### 2.2 DATABASE_URL 확인
- Variables 탭에서 `DATABASE_URL` 자동 생성 확인
- 형식: `postgresql://user:password@host:port/database`

---

## 📋 3단계: 환경변수 설정

Railway 프로젝트의 Variables 탭에서 다음 환경변수들을 설정:

### 3.1 필수 환경변수
```bash
# JWT 보안 키 (강력한 비밀번호 생성)
JWT_SECRET=instaup-super-secret-jwt-key-phase1-$(date +%s)

# 서버 포트 (Railway가 자동 설정하지만 명시)
PORT=3000

# 환경 설정
NODE_ENV=production

# CORS 설정 (현재 Netlify URL)
CORS_ORIGIN=https://same-4001w3tt33q-latest.netlify.app
FRONTEND_URL=https://same-4001w3tt33q-latest.netlify.app

# Phase 1 임시 결제 키 (테스트용)
KAKAO_PAY_CID=TC0ONETIME
KAKAO_PAY_SECRET_KEY=test-kakao-secret
TOSS_PAY_CLIENT_KEY=test_ck_docs_Ovk5rk1EwkEbP0W43n07xlzm
TOSS_PAY_SECRET_KEY=test-toss-secret

# 로깅 레벨
LOG_LEVEL=info

# Health Check 활성화
HEALTH_CHECK_ENABLED=true
```

### 3.2 환경변수 설정 방법
1. Railway 프로젝트 > Variables 탭 클릭
2. "Add Variable" 버튼 클릭
3. 위의 각 환경변수를 하나씩 추가

---

## 📋 4단계: 배포 설정

### 4.1 Root Directory 설정
1. Settings 탭 클릭
2. "Root Directory" 설정: `instaup-backend`
3. "Build Command" 확인: `npm run build`
4. "Start Command" 확인: `npm start`

### 4.2 Node.js 버전 확인
- Railway는 package.json의 engines 필드를 자동 감지
- 현재 설정: `"node": ">=18.0.0"`

---

## 📋 5단계: 배포 실행

### 5.1 수동 배포
1. Railway 대시보드에서 "Deploy Now" 클릭
2. 빌드 로그 확인
3. 성공 시 URL 자동 생성

### 5.2 자동 배포 설정
- GitHub 연동으로 main 브랜치 push 시 자동 배포
- 현재는 수동 배포로 진행

---

## 📋 6단계: 배포 확인

### 6.1 Health Check 테스트
배포 완료 후 생성된 URL로 테스트:

```bash
# Health Check (웹브라우저 또는 curl)
https://your-project-name.railway.app/health

# 예상 응답:
{
  "status": "OK",
  "timestamp": "2025-06-20T...",
  "uptime": 123.456,
  "environment": "production",
  "database": "connected",
  "version": "1.0.0",
  "phase": "skeleton"
}
```

### 6.2 Version 엔드포인트 테스트
```bash
# Version Check
https://your-project-name.railway.app/version

# 예상 응답:
{
  "version": "1.0.0",
  "phase": "skeleton",
  "build": "abc123...",
  "timestamp": "2025-06-20T...",
  "node_version": "v18.x.x"
}
```

---

## ✅ Phase 1 성공 기준

다음 조건들이 모두 만족되면 Railway 배포 성공:

- [ ] ✅ Railway 프로젝트 생성 완료
- [ ] ✅ PostgreSQL 서비스 연결 완료
- [ ] ✅ 모든 환경변수 설정 완료
- [ ] ✅ 배포 성공 (빌드 에러 없음)
- [ ] ✅ Health Check 엔드포인트 200 응답
- [ ] ✅ Version 엔드포인트 정상 응답
- [ ] ✅ Database 연결 상태 "connected"

---

## 🚨 문제 해결

### 빌드 실패 시
```bash
# 로컬에서 빌드 테스트
cd instaup-backend
npm install
npm run build
npm start
```

### 데이터베이스 연결 실패 시
1. Railway PostgreSQL 서비스 상태 확인
2. DATABASE_URL 환경변수 확인
3. Health Check에서 database: "disconnected" 확인

### 포트 에러 시
- Railway는 자동으로 PORT 환경변수 제공
- 코드에서 `process.env.PORT || 3000` 사용 확인

---

## 📝 다음 단계 (완료 후)

Railway 배포가 성공하면:
1. **생성된 URL을 기록**: `https://your-project.railway.app`
2. **Supabase 데이터베이스 설정으로 이동**
3. **Frontend 연결 설정 준비**

---

*Railway 배포 가이드 - Phase 1 Skeleton*
*업데이트: 2025-06-20*
