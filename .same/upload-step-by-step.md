# 📋 단계별 깃허브 업로드 가이드

## 🎯 1단계: Console 로그 확인

### 크롬 브라우저에서:
1. **사이트 접속**: https://comforting-vacherin-cb5d33.netlify.app/
2. **F12 키** 누르기
3. **Console 탭** 클릭
4. **로그인 시도**: user@example.com / password123
5. **로그 확인**:
   ```
   🔐 로그인 시도: user@example.com
   📡 Supabase 연결 테스트 중...
   📊 Supabase 응답: [데이터 확인]
   ```

## 🎯 2단계: ZIP 파일 압축 해제

### 파일 위치:
- **프로젝트 루트**: `/home/project/snsshop-clone/instaup-frontend-v20.zip`

### 압축 해제 후 폴더 구조:
```
instaup-frontend-v20/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── lib/
│   └── ...
├── package.json
├── index.html
├── README.md
└── ...
```

## 🎯 3단계: 깃허브 리포지토리 생성

### 새 리포지토리 설정:
- **이름**: `instaup-realtime-system`
- **설명**: `SNS 마케팅 플랫폼 - 실시간 주문 관리 시스템`
- **Public/Private**: 선택
- **README 초기화**: ✅

## 🎯 4단계: 파일 업로드

### 업로드할 파일들:
1. **모든 소스코드** (압축 해제한 내용)
2. **데이터베이스 스키마**: `database/supabase-schema.sql`
3. **설치 가이드**: `INSTALL.md`

### 폴더 구조 (권장):
```
instaup-realtime-system/
├── frontend/           # 프론트엔드 코드
│   ├── src/
│   ├── package.json
│   └── ...
├── database/           # 데이터베이스 스키마
│   ├── supabase-schema.sql
│   └── README.md
├── docs/              # 문서
│   ├── INSTALL.md
│   ├── API.md
│   └── DEPLOYMENT.md
└── README.md          # 프로젝트 설명
```

## 🎯 5단계: README.md 작성

### 포함할 내용:
```markdown
# INSTAUP - SNS 마케팅 플랫폼

## 🚀 주요 기능
- 실시간 주문 관리 시스템
- Supabase 데이터베이스 연동
- 자동 결제 및 포인트 시스템
- 관리자 알림 시스템

## 🛠️ 기술 스택
- Frontend: React + TypeScript + Tailwind CSS
- Backend: Supabase (PostgreSQL)
- Deployment: Netlify
- Package Manager: Bun

## 📋 설치 방법
1. 리포지토리 클론
2. Supabase 프로젝트 설정
3. 환경 변수 설정
4. 의존성 설치 및 실행

## 🔗 라이브 데모
https://comforting-vacherin-cb5d33.netlify.app/

## 📞 연락처
[연락처 정보]
```

## 🎯 6단계: 환경 변수 문서화

### .env.example 파일 생성:
```
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
VITE_APP_NAME=INSTAUP
VITE_APP_VERSION=1.0.0
```

## 🎯 7단계: 배포 설정

### Netlify 연동:
1. Netlify 대시보드 접속
2. **"Import from Git"** 선택
3. 깃허브 리포지토리 연결
4. 빌드 설정:
   - **Build command**: `bun run build`
   - **Publish directory**: `dist`
5. 환경 변수 설정

## ✅ 완료 체크리스트

- [ ] Console 로그 확인
- [ ] ZIP 파일 압축 해제
- [ ] 깃허브 리포지토리 생성
- [ ] 모든 파일 업로드
- [ ] README.md 작성
- [ ] 환경 변수 문서화
- [ ] Netlify 배포 설정
- [ ] 라이브 테스트
