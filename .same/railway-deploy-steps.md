# 🚀 Railway 백엔드 배포 가이드

## 📋 사전 준비 완료 상태
✅ 백엔드 코드 준비 완료
✅ Git 저장소 초기화 완료
✅ Production 환경변수 설정 완료
✅ Railway.toml 설정 완료

## 🎯 배포 단계

### 1단계: Railway 계정 생성 및 프로젝트 연결
1. **Railway 접속**: https://railway.app
2. **GitHub로 로그인**: "Sign up with GitHub" 클릭
3. **New Project** 클릭
4. **Deploy from GitHub repo** 선택

### 2단계: GitHub 저장소 업로드 필요
현재 백엔드 코드는 로컬에만 있습니다. GitHub에 업로드해야 합니다.

**옵션 1: GitHub CLI 사용 (추천)**
```bash
cd instaup-backend
gh repo create instaup-backend --public
git remote add origin https://github.com/[YOUR_USERNAME]/instaup-backend.git
git push -u origin master
```

**옵션 2: GitHub 웹사이트에서 수동 생성**
1. GitHub.com → New Repository → "instaup-backend"
2. 아래 명령어로 연결:
```bash
cd instaup-backend
git remote add origin https://github.com/[YOUR_USERNAME]/instaup-backend.git
git push -u origin master
```

### 3단계: Railway에서 저장소 선택
1. Railway에서 방금 생성한 저장소 선택
2. 자동 배포 시작됨

### 4단계: 환경변수 설정
Railway 대시보드에서 다음 환경변수들을 설정:

```
DATABASE_URL=postgresql://neondb_owner:npg_iOoxz5mEIld4@ep-square-night-a8xgq1f6-pooler.eastus2.azure.neon.tech/neondb?sslmode=require
JWT_SECRET=instaup-super-secret-jwt-key-2024-production
JWT_EXPIRE=7d
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://same-4001w3tt33q-latest.netlify.app
KAKAO_PAY_CID=TC0ONETIME
TOSS_PAY_CLIENT_KEY=test_ck_docs_Ovk5rk1EwkEbP0W43n07xlzm
TOSS_PAY_SECRET_KEY=test_sk_docs_OepqKqQRQbsOXm6ItYNQMG1JJAK6
ADMIN_EMAIL=neulketing@gmail.com
ADMIN_PASSWORD=smfzpxld1!
ADMIN_NAME=Super Admin
```

### 5단계: 배포 완료 확인
1. Railway 대시보드에서 배포 로그 확인
2. 배포 완료 후 도메인 URL 확인 (예: `https://instaup-backend-production.up.railway.app`)
3. Health check: `https://[YOUR_DOMAIN]/health` 접속 테스트

## 🔧 배포 후 작업

### 프런트엔드 API URL 업데이트
Railway 배포 완료 후 생성된 URL로 프런트엔드 API URL을 업데이트해야 합니다.

```typescript
// snsshop-clone/src/services/api.ts
const API_BASE_URL = 'https://[RAILWAY_DOMAIN]/api'
```

## ⚠️ 주의사항
- 환경변수에 실제 비밀번호가 포함되어 있으니 Public 저장소 주의
- DATABASE_URL은 Neon 데이터베이스를 그대로 사용
- CORS_ORIGIN은 Netlify 배포 URL로 설정됨

## 🎯 배포 성공 기준
✅ Railway 대시보드에서 "Deployed" 상태
✅ Health check API 응답 확인
✅ 실제 API 엔드포인트 테스트 성공

---

**다음 단계**: Railway 배포 완료 후 프런트엔드 Netlify 배포 진행
