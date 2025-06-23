# 🚂 Railway 배포 - 실행 단계

## ✅ 준비 완료사항
- [x] Backend 코드 빌드 성공
- [x] Health Check 로컬 테스트 성공 (http://localhost:3001/health)
- [x] Railway 설정 파일 생성 (railway.json)
- [x] Package.json 배포용 설정 완료

---

## 📋 Step 1: Railway 계정 생성 (5분)

### 1.1 Railway 접속
1. 브라우저에서 https://railway.app 접속
2. "Start a New Project" 클릭
3. "Login with GitHub" 선택
4. GitHub 계정으로 로그인
5. Railway 권한 승인

### 1.2 새 프로젝트 생성
1. "Deploy from GitHub repo" 선택
2. 현재 레포지토리 선택 (instaup 또는 유사 이름)
3. 프로젝트 이름: `instaup-backend` 입력
4. "Deploy Now" 클릭

---

## 📋 Step 2: PostgreSQL 데이터베이스 추가 (5분)

### 2.1 Database 서비스 추가
1. Railway 대시보드에서 "Add Service" 클릭
2. "Database" 선택
3. "PostgreSQL" 선택
4. 자동으로 DATABASE_URL 생성됨 (Variables 탭에서 확인)

---

## 📋 Step 3: 환경변수 설정 (15분)

Railway 프로젝트의 **Variables** 탭에서 다음 환경변수들을 하나씩 추가:

### 3.1 필수 환경변수 입력
```bash
# 1. JWT 보안 키
JWT_SECRET=instaup-super-secret-jwt-key-phase1-railway-2024

# 2. 서버 환경
NODE_ENV=production

# 3. CORS 설정 (현재 Netlify URL)
CORS_ORIGIN=https://same-4001w3tt33q-latest.netlify.app

# 4. Phase 1 임시 결제 키 (테스트용)
KAKAO_PAY_CID=TC0ONETIME
KAKAO_PAY_SECRET_KEY=test-kakao-secret
TOSS_PAY_CLIENT_KEY=test_ck_docs_Ovk5rk1EwkEbP0W43n07xlzm
TOSS_PAY_SECRET_KEY=test-toss-secret

# 5. 로깅
LOG_LEVEL=info

# 6. Health Check
HEALTH_CHECK_ENABLED=true
```

### 3.2 환경변수 추가 방법
1. Variables 탭 클릭
2. "New Variable" 버튼 클릭
3. Variable Name에 키 입력 (예: JWT_SECRET)
4. Variable Value에 값 입력
5. "Add" 클릭
6. 위의 모든 환경변수에 대해 반복

---

## 📋 Step 4: 배포 설정 확인 (5분)

### 4.1 Service Settings 확인
1. Railway 대시보드에서 Backend 서비스 클릭
2. "Settings" 탭 클릭
3. 다음 설정들 확인/수정:

**Build & Deploy:**
- Build Command: `npm run build` (자동 감지됨)
- Start Command: `npm start` (자동 감지됨)
- Root Directory: `instaup-backend` (설정 필요)

**Environment:**
- Node.js 버전: 18.x (자동 감지됨)

### 4.2 Root Directory 설정
1. Settings > "Source Repo" 섹션
2. "Root Directory" 필드에 `instaup-backend` 입력
3. "Save" 클릭

---

## 📋 Step 5: 배포 실행 및 확인 (10분)

### 5.1 배포 시작
1. Railway 대시보드 메인 화면
2. "Deploy" 버튼 클릭 (또는 자동 배포 대기)
3. "Build Logs" 확인 (빌드 진행 상황 모니터링)

### 5.2 배포 성공 확인
배포 완료 후 생성된 URL 확인:
1. "Deployments" 탭 > 최신 배포 > "View Logs"
2. 성공 메시지: `🚀 Instaup Backend Server (Phase 1) running on port...`
3. "Settings" 탭 > "Domains" 섹션에서 생성된 URL 복사

### 5.3 Health Check 테스트
생성된 URL로 테스트 (예시):
```bash
# 브라우저 또는 curl로 테스트
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

---

## ✅ 배포 성공 기준

다음 조건들이 모두 만족되면 Railway 배포 성공:

- [ ] ✅ Railway 프로젝트 생성 완료
- [ ] ✅ PostgreSQL 서비스 연결 완료
- [ ] ✅ 모든 환경변수 설정 완료
- [ ] ✅ Root Directory 설정 완료
- [ ] ✅ 배포 성공 (빌드 에러 없음)
- [ ] ✅ Health Check URL 200 응답
- [ ] ✅ Database 연결 상태 "connected"

---

## 🚨 문제 해결

### 빌드 실패 시
1. "Build Logs" 확인
2. npm install 오류 → package.json 확인
3. TypeScript 빌드 오류 → 코드 문법 확인

### 서버 시작 실패 시
1. "Deploy Logs" 확인
2. 환경변수 누락 → Variables 탭에서 재확인
3. 포트 오류 → Railway는 자동으로 PORT 환경변수 제공

### Database 연결 실패 시
1. PostgreSQL 서비스 상태 확인
2. DATABASE_URL 환경변수 자동 생성 확인
3. Health Check에서 database: "disconnected" 표시 시 위 확인

---

## 🎯 다음 단계

Railway 배포 성공 후:
1. **생성된 URL 기록** → Frontend 연결에 사용
2. **Prisma 마이그레이션 실행** → Database 테이블 생성
3. **Frontend API 연결 설정** → Phase 1 완료

---

*Railway 배포 실행 가이드 - Phase 1 Skeleton*
*업데이트: 2025-06-20*
