# 🚄 Railway 웹 배포 가이드

## 1. Railway 프로젝트 생성

### 1-1. Railway 접속 및 로그인
1. **Railway 웹사이트**: https://railway.app
2. **GitHub 계정으로 로그인** 클릭
3. GitHub 권한 승인

### 1-2. 새 프로젝트 생성
1. **"New Project"** 버튼 클릭
2. **"Deploy from GitHub repo"** 선택
3. **저장소 선택**: `neulketing/instaup`
4. **루트 디렉토리 설정**: `backend`

## 2. 서비스 설정

### 2-1. PostgreSQL 데이터베이스 추가
1. 프로젝트 대시보드에서 **"+ New"** 클릭
2. **"Database"** → **"Add PostgreSQL"** 선택
3. 데이터베이스 생성 완료 후 **DATABASE_URL** 자동 생성

### 2-2. 백엔드 서비스 설정
1. **"Settings"** 탭 이동
2. **"Root Directory"** 설정: `backend`
3. **"Build Command"**: `npm run build` (자동 설정됨)
4. **"Start Command"**: `npm start` (자동 설정됨)

## 3. 환경 변수 설정

**"Variables"** 탭에서 다음 환경 변수들을 추가하세요:

```bash
# 필수 환경 변수
NODE_ENV=production
JWT_SECRET=instaup-super-secure-jwt-secret-key-2024
DATABASE_URL=${{Postgres.DATABASE_URL}}

# CORS 설정
CORS_ORIGIN=https://same-4001w3tt33q-latest.netlify.app
FRONTEND_URL=https://same-4001w3tt33q-latest.netlify.app

# 결제 설정 (테스트용)
KAKAO_PAY_CID=TC0ONETIME
KAKAO_PAY_SECRET_KEY=test-kakao-secret
TOSS_PAY_CLIENT_KEY=test_ck_docs_Ovk5rk1EwkEbP0W43n07xlzm
TOSS_PAY_SECRET_KEY=test-toss-secret

# 로깅
LOG_LEVEL=info
HEALTH_CHECK_ENABLED=true
```

## 4. 배포 실행

### 4-1. 자동 배포 시작
1. **"Deploy"** 버튼 클릭
2. 빌드 로그 실시간 확인
3. 배포 성공 시 **URL 생성됨**

### 4-2. 데이터베이스 마이그레이션
배포 완료 후:
1. **"Console"** 탭에서 터미널 접근
2. 다음 명령어 실행:
```bash
npx prisma db push
```

## 5. 배포 확인

### 5-1. 헬스 체크
- **URL**: `https://[your-railway-url]/health`
- **응답**: `200 OK`와 건강 상태 JSON

### 5-2. 데이터베이스 연결 확인
- PostgreSQL 연결 상태 확인
- Prisma 테이블 생성 확인

## 6. 예상 결과

✅ **배포 성공 시:**
- Railway URL: `https://instaup-backend-production-xxx.up.railway.app`
- Health Check: `https://instaup-backend-production-xxx.up.railway.app/health`
- 데이터베이스 연결 성공
- API 엔드포인트 접근 가능

## 7. 트러블슈팅

### 빌드 실패 시:
- `package.json` scripts 확인
- Node.js 버전 확인 (18.x 권장)

### 데이터베이스 연결 실패 시:
- `DATABASE_URL` 환경변수 확인
- PostgreSQL 서비스 상태 확인

### 헬스 체크 실패 시:
- PORT 환경변수 자동 설정 확인
- CORS 설정 확인

---

## 📞 다음 단계

배포 완료 후 생성된 **Railway URL**을 프론트엔드 환경변수에 설정하여 API 연동을 완료하세요!
