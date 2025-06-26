# 🚀 INSTAUP - SNS 마케팅 플랫폼

> 실제 한국인 SNS 마케팅 서비스를 제공하는 현대적인 웹 플랫폼

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/neulketing/instaup)
[![Railway](https://img.shields.io/badge/Railway-Deployed-success)](https://railway.app)
[![Netlify](https://img.shields.io/badge/Netlify-Frontend-brightgreen)](https://netlify.app)

## 📁 프로젝트 구조

```
📦 INSTAUP
├── 🖥️ backend/                    # Node.js + Express + Prisma 백엔드
│   ├── src/                       # 소스 코드
│   ├── prisma/                    # 데이터베이스 스키마
│   ├── package.json              # 백엔드 의존성
│   └── railway.json              # Railway 배포 설정
│
├── 🎨 frontend/                   # 프론트엔드 애플리케이션들
│   ├── classic/                   # React + Vite (메인 서비스)
│   └── modern/                    # React + Vite (모던 버전)
│
├── 📁 archive/                    # 레거시 & 참고용 코드
│   ├── snsshop-clone/            # 참조용 SNS샵 클론
│   ├── phases/                   # 단계별 개발 계획
│   └── TODO.md                   # 과거 할일 목록
│
├── 🎯 assets/                     # 공통 리소스
│   └── uploads/                  # 업로드된 이미지들
│
├── 📚 docs/                       # 프로젝트 문서
├── ⚙️ .github/                    # GitHub Actions CI/CD
├── 🛠️ .same/                      # Same IDE 설정 & 메모
└── 📄 README.md                  # 이 파일
```

## 🚀 빠른 시작

### 백엔드 실행
```bash
cd backend
bun install
bun run dev
```

### 프론트엔드 실행 (Classic)
```bash
cd frontend/classic
bun install
bun run dev
```

### 프론트엔드 실행 (Modern)
```bash
cd frontend/modern
bun install
bun run dev
```

## 🛠️ 기술 스택

### 백엔드
- **Framework**: Node.js + Express
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT
- **Payment**: 토스페이, 카카오페이
- **Deployment**: Railway

### 프론트엔드
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Context API
- **Deployment**: Netlify

### 개발 도구
- **Package Manager**: Bun
- **Linting**: Biome
- **CI/CD**: GitHub Actions
- **IDE**: Same (Cloud IDE)

## 📊 주요 기능

### 🎯 서비스 관리
- 인스타그램, 틱톡, 유튜브 등 다중 플랫폼 지원
- 좋아요, 팔로워, 조회수 등 다양한 서비스
- 실시간 주문 진행률 추적

### 💰 결제 시스템
- 토스페이, 카카오페이 통합
- 포인트 충전 및 관리
- 주문 내역 & 결제 내역

### 👥 추천인 시스템
- 다단계 추천 구조 (3단계)
- 실시간 커미션 계산
- 추천인 통계 대시보드

### 👨‍💼 관리자 패널
- 서비스 관리
- 주문 모니터링
- 사용자 관리
- 매출 분석

## 🌐 배포된 서비스

### 프로덕션 환경
- **백엔드**: [Railway 배포 URL](https://instaup-backend-production.up.railway.app)
- **프론트엔드**: [Netlify 배포 URL](https://same-4001w3tt33q-latest.netlify.app)

### 헬스체크
- **API 상태**: `GET /health`
- **데이터베이스**: PostgreSQL 연결 확인

## 📖 문서

- [백엔드 README](./backend/README.md)
- [프론트엔드 Classic README](./frontend/classic/README.md)
- [프론트엔드 Modern README](./frontend/modern/README.md)
- [Railway 배포 가이드](./backend/RAILWAY_WEB_DEPLOY.md)
- [프로젝트 로드맵](./docs/ROADMAP.md)

## 🗂️ 아카이브

레거시 및 참고용 코드들은 `archive/` 폴더에 보관되어 있습니다:

- **snsshop-clone**: 초기 참조용 SNS샵 클론 코드
- **phases**: 단계별 개발 계획 문서들
- **TODO.md**: 과거 개발 할일 목록

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

- **개발팀**: [GitHub Issues](https://github.com/neulketing/instaup/issues)
- **비즈니스**: [이메일](mailto:contact@instaup.co.kr)

---

<div align="center">

**🚀 실제 한국인 SNS 마케팅의 새로운 기준, INSTAUP 🚀**

Made with ❤️ by INSTAUP Team

</div>
