# 🚀 INSTAUP Backend

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

> **SNS 마케팅 플랫폼의 백엔드 API 서버**
> 인스타그램, 유튜브, 틱톡 등 소셜미디어 마케팅 서비스를 제공하는 플랫폼

## 📋 목차

- [✨ 주요 기능](#-주요-기능)
- [🛠 기술 스택](#-기술-스택)
- [🚀 빠른 시작](#-빠른-시작)
- [📁 프로젝트 구조](#-프로젝트-구조)
- [🌐 API 문서](#-api-문서)
- [🔧 환경 설정](#-환경-설정)
- [📦 배포](#-배포)
- [🤝 기여하기](#-기여하기)

## ✨ 주요 기능

### 🔐 사용자 인증
- JWT 기반 회원가입/로그인
- 안전한 비밀번호 해싱 (bcrypt)
- 토큰 기반 API 인증

### 📊 서비스 관리
- 다양한 SNS 플랫폼 지원 (Instagram, YouTube, TikTok)
- 실시간 가격 계산
- 수량별 할인 시스템

### 💰 결제 시스템
- 카카오페이 결제 연동
- 토스페이 결제 연동
- 포인트/잔액 결제 시스템

### 📈 주문 관리
- 실시간 주문 추적
- 주문 상태 관리
- 자동 진행 상황 업데이트

### 👑 관리자 기능
- 서비스 관리
- 사용자 관리
- 주문 현황 모니터링
- 실시간 분석 대시보드

## 🛠 기술 스택

### **Core**
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma

### **Authentication & Security**
- **JWT**: jsonwebtoken
- **Password**: bcryptjs
- **Security**: helmet, cors

### **Payment Integration**
- **KakaoPay**: REST API
- **TossPay**: REST API
- **Validation**: Zod

### **Development**
- **Build**: TypeScript Compiler
- **Package Manager**: npm
- **Deployment**: Railway

## 🚀 빠른 시작

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/instaup-backend.git
cd instaup-backend
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경변수 설정
```bash
cp .env.example .env
# .env 파일을 편집하여 필요한 환경변수 설정
```

### 4. 데이터베이스 설정
```bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 동기화
npm run db:push
```

### 5. 개발 서버 실행
```bash
npm run dev
```

서버가 `http://localhost:3000`에서 실행됩니다.

## 📁 프로젝트 구조

```
instaup-backend/
├── src/
│   ├── config/          # 설정 파일들
│   │   ├── database.ts  # Prisma 데이터베이스 설정
│   │   └── redis.ts     # Redis 설정
│   ├── controllers/     # 컨트롤러 로직
│   │   └── authController.ts
│   ├── middleware/      # 미들웨어
│   │   ├── auth.ts      # 인증 미들웨어
│   │   └── errorHandler.ts
│   ├── routes/          # API 라우트
│   │   ├── auth.ts      # 인증 라우트
│   │   ├── service.ts   # 서비스 라우트
│   │   ├── order.ts     # 주문 라우트
│   │   └── payment.ts   # 결제 라우트
│   ├── services/        # 비즈니스 로직
│   │   ├── paymentService.ts
│   │   └── socketService.ts
│   ├── types/           # TypeScript 타입 정의
│   │   └── index.ts
│   ├── utils/           # 유틸리티 함수
│   │   ├── helpers.ts
│   │   └── logger.ts
│   └── index.ts         # 애플리케이션 진입점
├── prisma/
│   └── schema.prisma    # 데이터베이스 스키마
├── package.json
├── tsconfig.json
├── railway.toml         # Railway 배포 설정
└── README.md
```

## 🌐 API 문서

### 기본 URL
```
Production: https://your-app.railway.app
Development: http://localhost:3000
```

### 주요 엔드포인트

#### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/profile` - 프로필 조회

#### 서비스
- `GET /api/services` - 서비스 목록 조회
- `GET /api/services/:id` - 서비스 상세 조회

#### 주문
- `POST /api/orders` - 주문 생성
- `GET /api/orders` - 주문 목록 조회
- `GET /api/orders/:id` - 주문 상세 조회

#### 결제
- `POST /api/payments/kakao/ready` - 카카오페이 결제 준비
- `POST /api/payments/toss/confirm` - 토스페이 결제 승인

#### 관리자
- `GET /api/admin/dashboard` - 관리자 대시보드
- `GET /api/admin/users` - 사용자 관리
- `GET /api/admin/orders` - 주문 관리

### 응답 형식
```json
{
  "success": true,
  "data": { ... },
  "message": "성공 메시지"
}
```

에러 응답:
```json
{
  "success": false,
  "error": "에러 메시지"
}
```

## 🔧 환경 설정

### 필수 환경변수

```bash
# 데이터베이스
DATABASE_URL="postgresql://username:password@localhost:5432/instaup"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# 서버 설정
NODE_ENV="development"
PORT=3000

# CORS
CORS_ORIGIN="http://localhost:3000"
FRONTEND_URL="http://localhost:3000"

# 결제 시스템
KAKAO_PAY_CID="your-kakao-cid"
KAKAO_PAY_SECRET_KEY="your-kakao-secret"
TOSS_PAY_CLIENT_KEY="your-toss-client-key"
TOSS_PAY_SECRET_KEY="your-toss-secret"

# 기타
REDIS_URL="redis://localhost:6379"
LOG_LEVEL="info"
```

## 📦 배포

### Railway 배포 (권장)

1. **Railway 가입**
   ```
   https://railway.app
   ```

2. **GitHub 연동 배포**
   - "New Project" → "Deploy from GitHub repo"
   - 저장소 선택 후 자동 배포

3. **PostgreSQL 추가**
   - "Add Service" → "Database" → "PostgreSQL"

4. **환경변수 설정**
   - Railway 대시보드에서 Variables 설정

5. **데이터베이스 마이그레이션**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

자세한 배포 가이드: [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md)

### 수동 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm start
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'Add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 연락처

- **Email**: neulketing@gmail.com
- **GitHub**: [@your-username](https://github.com/your-username)
- **Frontend Repository**: [instaup-frontend](https://github.com/your-username/instaup-frontend)

---

⭐️ **이 프로젝트가 도움이 되었다면 스타를 눌러주세요!**
