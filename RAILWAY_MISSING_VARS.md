# 🔧 Railway 추가 환경 변수 설정

## ⚠️ Railway Variables 탭에서 다음 변수들을 **추가**하세요:

### 1. 필수 환경변수
```env
DATABASE_URL=(자동생성됨 - PostgreSQL)
NODE_ENV=production
CORS_ORIGIN=https://instaup.kr
FRONTEND_URL=https://instaup.kr
```

### 2. Railway 서버 설정
```env
PORT=(자동할당 - 제거하세요)
HOST=0.0.0.0
```

### 3. JWT 및 보안 설정
```env
JWT_SECRET=your-super-secret-jwt-key-here
API_KEY=your-api-key-here
```

## 🚀 설정 후 Railway 재배포
Variables 설정 완료 후:
1. Settings → "Redeploy" 클릭
2. 또는 GitHub에 새 커밋 푸시

## ✅ 성공 확인 방법
```bash
curl https://instaup-production.up.railway.app/health
```

**예상 응답:**
```json
{
  "status": "OK",
  "database": "connected",
  "railway_deployment": "active"
}
```
