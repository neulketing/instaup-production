# 🔧 Railway 백엔드 연결 문제 해결 가이드

## 1. Railway 로그 확인
```bash
# Railway 웹 콘솔에서 확인
1. railway.app/dashboard 접속
2. instaup 프로젝트 선택
3. "Deployments" 탭 → "View logs" 클릭
4. 에러 메시지 확인
```

## 2. 환경 변수 설정 확인
Railway Variables 탭에서 다음 변수들이 설정되어 있는지 확인:

```env
DATABASE_URL=postgresql://[자동생성됨]
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://instaup.kr
```

## 3. 데이터베이스 마이그레이션 실행
```bash
# Railway CLI 사용 (터미널에서)
railway login
railway link [프로젝트-id]
railway run npx prisma migrate deploy
railway run npx prisma generate
```

## 4. 백엔드 코드 재배포
```bash
# 현재 폴더에서 Railway 재배포
git add .
git commit -m "Fix backend deployment"
git push railway main
```

## 5. 연결 테스트
```bash
# API 응답 확인
curl https://instaup-production.up.railway.app/health
curl https://instaup-production.up.railway.app/api/admin/products
```

## 예상 에러와 해결책

### 에러: "Can't reach database server"
**해결**: DATABASE_URL 환경 변수 확인 및 PostgreSQL 서비스 재시작

### 에러: "Port already in use"
**해결**: Railway Settings에서 PORT 변수를 제거 (자동 할당되도록)

### 에러: "Module not found"
**해결**: package.json dependencies 확인 및 npm install 재실행

## 📞 백엔드 연결 성공 시 확인사항

1. **API 응답 확인**: https://instaup-production.up.railway.app/health
2. **프론트엔드 연동**: instaup.kr에서 실제 데이터 로드
3. **관리자 페이지**: instaup.kr/admin에서 실시간 상품 관리
4. **실시간 동기화**: 관리자가 상품을 수정하면 고객 페이지에 즉시 반영

## 🎯 최종 목표
```
👥 instaup.kr/ (고객) ↔️ 🗄️ Railway DB ↔️ 👨‍💼 instaup.kr/admin (관리자)
```
완전한 실시간 데이터 동기화 시스템
