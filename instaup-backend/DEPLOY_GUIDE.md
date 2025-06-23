# 🚀 INSTAUP 완전 배포 가이드

## 📋 전체 프로세스 개요

1. **백엔드 서버 배포** (Railway)
2. **도메인 설정** (instaup.kr)
3. **프론트엔드 도메인 연결** (Netlify)
4. **API 연결 설정**
5. **결제 시스템 연동**

---

## 🎯 **Step 1: Railway 백엔드 배포**

### 1-1. Railway 가입 및 프로젝트 생성

1. **Railway 웹사이트 접속**
   - https://railway.app 방문
   - GitHub 계정으로 로그인

2. **새 프로젝트 생성**
   - "New Project" 클릭
   - "Deploy from GitHub repo" 선택
   - `instaup-backend` 저장소 선택

### 1-2. 환경변수 설정

Railway 대시보드에서 다음 환경변수들을 설정하세요:

```bash
# 필수 환경변수
NODE_ENV=production
PORT=3000
JWT_SECRET=instaup_jwt_secret_key_2024_super_secure
CORS_ORIGIN=https://instaup.kr
FRONTEND_URL=https://instaup.kr

# 결제 시스템 (테스트 키)
KAKAO_PAY_CID=TC0ONETIME
KAKAO_PAY_SECRET_KEY=테스트용_나중에_실제키로_변경
TOSS_PAY_CLIENT_KEY=test_ck_docs_Ovk5rk1EwkEbP0W43n07xlzm
TOSS_PAY_SECRET_KEY=test_sk_docs_OePz8L5KdmQXkzRzwayLN7EG
```

### 1-3. 데이터베이스 추가

1. Railway 프로젝트에서 "Add Service" 클릭
2. "Database" → "PostgreSQL" 선택
3. 자동으로 `DATABASE_URL` 환경변수가 생성됨

### 1-4. 배포 완료 확인

- Railway에서 배포 URL 확인 (예: `https://instaup-backend-production.up.railway.app`)
- `/health` 엔드포인트 접속하여 서버 상태 확인

---

## 🌐 **Step 2: 도메인 연결 설정**

### 2-1. 현재 도메인 연결 해제

**현재 instaup.kr이 연결된 서비스에서:**
1. 도메인 관리 페이지 접속
2. DNS 설정 또는 네임서버 설정 해제
3. 도메인 등록기관 (가비아, 후이즈 등)에서 네임서버를 기본값으로 변경

### 2-2. Netlify에 도메인 연결

**Netlify 대시보드에서:**
1. 사이트 설정 → "Domain management" 접속
2. "Add custom domain" 클릭
3. `instaup.kr` 입력
4. DNS 설정 안내 확인

**도메인 등록기관에서:**
```
A Record: @ → Netlify IP (자동 제공됨)
CNAME: www → instaup.kr
CNAME: api → Railway 백엔드 URL
```

### 2-3. SSL 인증서 설정

- Netlify에서 자동으로 Let's Encrypt SSL 인증서 발급
- 24시간 내에 HTTPS 활성화 완료

---

## 🔧 **Step 3: API 연결 설정**

### 3-1. 프론트엔드 API URL 업데이트

현재 프론트엔드 코드에서 API URL을 변경해야 합니다:

**수정할 파일들:**
- `src/components/PaymentModal.tsx`
- 기타 API 호출하는 컴포넌트들

**변경 내용:**
```typescript
// 기존
const API_BASE_URL = 'http://localhost:3001'

// 변경 후
const API_BASE_URL = 'https://api.instaup.kr'
// 또는 Railway 직접 URL
const API_BASE_URL = 'https://instaup-backend-production.up.railway.app'
```

---

## 💳 **Step 4: 결제 시스템 실제 연동**

### 4-1. 카카오페이 가맹점 신청

1. **카카오페이 파트너 센터 접속**
   - https://partner.kakao.com/
   - 사업자 정보로 가입

2. **결제 서비스 신청**
   - 사업자등록증 업로드
   - 서비스 설명서 제출
   - 심사 완료 (3-5일 소요)

3. **운영 키 발급 받기**
   - `KAKAO_PAY_CID`: 실제 CID
   - `KAKAO_PAY_SECRET_KEY`: 실제 시크릿 키

### 4-2. 토스페이먼츠 가맹점 신청

1. **토스페이먼츠 접속**
   - https://www.tosspayments.com/
   - 사업자 정보로 가입

2. **API 키 발급**
   - 개발자 센터에서 라이브 키 발급
   - `TOSS_PAY_CLIENT_KEY`: 클라이언트 키
   - `TOSS_PAY_SECRET_KEY`: 시크릿 키

---

## 📊 **Step 5: 최종 테스트 및 확인**

### 5-1. 기능 테스트 체크리스트

- [ ] `https://instaup.kr` 접속 확인
- [ ] 회원가입/로그인 테스트
- [ ] 서비스 목록 조회 테스트
- [ ] 주문 생성 테스트 (기본 기능)
- [ ] 관리자 로그인 테스트 (`neulketing@gmail.com` / `smfzpxld1!`)

### 5-2. 성능 및 보안 확인

- [ ] SSL 인증서 활성화 확인
- [ ] API 응답 속도 테스트
- [ ] CORS 설정 확인
- [ ] 데이터베이스 연결 확인

---

## 💰 **호스팅 비용 및 관리**

### 월 예상 비용
- **Netlify (프론트엔드)**: 무료
- **Railway (백엔드 + DB)**: $5-20/월 (트래픽에 따라)
- **도메인 갱신**: 연 15,000원 정도

### 관리 방법
- **모니터링**: Railway 대시보드에서 서버 상태 확인
- **로그 확인**: Railway에서 실시간 로그 조회 가능
- **업데이트**: GitHub에 코드 푸시하면 자동 배포

---

## 🆘 **문제 해결 가이드**

### 자주 발생하는 문제들

1. **API 연결 오류**
   - CORS 설정 확인
   - 환경변수 설정 확인

2. **데이터베이스 연결 오류**
   - `DATABASE_URL` 환경변수 확인
   - Railway PostgreSQL 서비스 상태 확인

3. **도메인 연결 문제**
   - DNS 전파 시간 대기 (최대 24시간)
   - 네임서버 설정 재확인

---

## 📞 **다음 단계**

배포 완료 후:
1. **실제 결제 시스템 연동** (카카오페이/토스페이 실제 키 적용)
2. **SNS 작업 처리 시스템** 구현
3. **고객 지원 시스템** (FAQ, 1:1 문의) 구축
4. **마케팅 기능** (추천인 시스템, 이벤트) 고도화

---

*배포 과정에서 문제가 발생하면 언제든 문의하세요!*
