# 🚀 INSTAUP Backend - Railway 배포 가이드

## ✅ 배포 준비 완료!

### 📋 체크리스트
- [x] **TypeScript 빌드 성공** (`npm run build` ✅)
- [x] **모든 의존성 설치 완료**
- [x] **package.json 설정 완료**
- [x] **railway.toml 설정 완료**
- [x] **환경변수 준비 완료**

---

## 🎯 Railway 배포 단계

### **Step 1: Railway 가입**
1. https://railway.app 접속
2. "Sign up with GitHub" 클릭
3. GitHub 계정으로 로그인

### **Step 2: 새 프로젝트 생성**
1. Railway 대시보드에서 **"New Project"** 클릭
2. **"Deploy from GitHub repo"** 선택
3. `instaup-backend` 저장소 선택
4. 자동 배포 시작

### **Step 3: PostgreSQL 데이터베이스 추가**
1. 프로젝트 대시보드에서 **"Add Service"** 클릭
2. **"Database" → "PostgreSQL"** 선택
3. 자동으로 `DATABASE_URL` 환경변수 생성됨

### **Step 4: 환경변수 설정**
프로젝트 설정 → Variables에서 다음 변수들을 추가:

```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=instaup_jwt_secret_2024_super_secure_key
CORS_ORIGIN=https://delicate-profiterole-bbf92a.netlify.app
FRONTEND_URL=https://delicate-profiterole-bbf92a.netlify.app

# 결제 시스템 (테스트 키)
KAKAO_PAY_CID=TC0ONETIME
KAKAO_PAY_SECRET_KEY=test_kakao_secret_key
TOSS_PAY_CLIENT_KEY=test_ck_docs_Ovk5rk1EwkEbP0W43n07xlzm
TOSS_PAY_SECRET_KEY=test_sk_docs_OePz8L5KdmQXkzRzwayLN7EG

# 로깅
LOG_LEVEL=info
```

### **Step 5: Prisma 마이그레이션**
배포 완료 후 Railway 콘솔에서 실행:
```bash
npx prisma generate
npx prisma db push
```

---

## 🔧 배포 후 확인사항

### **1. 배포 URL 확인**
- Railway에서 제공하는 URL 형식: `https://[프로젝트명].railway.app`
- 예시: `https://instaup-backend-production.railway.app`

### **2. API 엔드포인트 테스트**

#### Health Check:
```bash
GET https://[배포URL]/health
```

#### 서비스 목록:
```bash
GET https://[배포URL]/api/services
```

#### 회원가입 테스트:
```bash
POST https://[배포URL]/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "nickname": "테스트유저"
}
```

### **3. 프론트엔드 연결**
배포 완료 후 프론트엔드 환경변수 업데이트:

#### `.env` 파일 수정:
```bash
VITE_API_URL=https://[Railway-배포-URL].railway.app
```

#### Netlify 환경변수 설정:
1. Netlify 대시보드 → Site settings → Environment variables
2. `VITE_API_URL` 추가: `https://[Railway-배포-URL].railway.app`
3. Deploy 트리거 또는 자동 재배포 대기

---

## 🎉 성공 확인

### **예상 결과:**
- ✅ 백엔드: `https://[프로젝트명].railway.app`
- ✅ 프론트엔드: `https://delicate-profiterole-bbf92a.netlify.app`
- ✅ 실제 로그인/회원가입 작동
- ✅ 서비스 목록 조회 작동
- ✅ 결제 시스템 테스트 가능

### **최종 테스트:**
1. 프론트엔드에서 회원가입 테스트
2. 로그인 테스트
3. 서비스 주문 테스트
4. 결제 플로우 테스트

---

## 🚨 문제 해결

### **일반적인 이슈:**

#### 1. 빌드 실패
- Railway 콘솔에서 빌드 로그 확인
- `package.json` 스크립트 확인

#### 2. 환경변수 누락
- Railway 대시보드에서 Variables 재확인
- `DATABASE_URL`이 자동 생성되었는지 확인

#### 3. Prisma 연결 실패
- Railway 콘솔에서 `npx prisma db push` 재실행
- 데이터베이스 서비스가 활성화되었는지 확인

#### 4. CORS 에러
- `CORS_ORIGIN` 환경변수가 올바른 프론트엔드 URL인지 확인

---

## 📊 배포 상태: ✅ 준비 완료

**모든 코드와 설정이 완료되었습니다!**

Railway 가입 → GitHub 연동 → 환경변수 설정 → 마이그레이션만 하면
**실제 사용 가능한 SNS 마케팅 플랫폼**이 완성됩니다!

---

*Last updated: 2025-01-15*
