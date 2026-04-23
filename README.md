# 📝 Modern TypeScript Memo App

현대적인 TypeScript 기술 스택을 활용한 메모 관리 애플리케이션입니다. Backend(Express)와 Frontend(Vue 3) 간의 타입 안정성을 확보하고, 깔끔한 아키텍처를 지향합니다.

## 🚀 주요 기능
- **메모 관리:** 생성, 조회, 수정, 삭제(CRUD) 기능 제공
- **카테고리 분류:** 일반, 개발, 쇼핑, 기타 카테고리별 필터링
- **반응형 디자인:** 다양한 디바이스 환경에 최적화된 UI

## 🛠 기술 스택

### Backend
- **Runtime:** Node.js
- **Framework:** Express (v5)
- **Language:** TypeScript (v6)
- **Database:** Supabase (PostgreSQL)
- **Dev Tool:** `tsx` (Watch mode 지원)

### Frontend
- **Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Vanilla CSS (Modern interactive UI)
- **API Client:** Axios

## 📂 프로젝트 구조

```text
/
├── backend/            # Express 서버
│   ├── src/
│   │   ├── config/     # Supabase 설정
│   │   ├── controllers/# 비즈니스 로직
│   │   ├── models/     # 타입 정의
│   │   ├── routes/     # 라우팅 설정
│   │   └── index.ts    # 엔트리 포인트
│   └── tsconfig.json   # 백엔드 TS 설정
├── frontend/           # Vue SPA
│   ├── src/
│   │   ├── App.vue     # 메인 컴포넌트
│   │   └── main.ts     # 엔트리 포인트
│   └── tsconfig.json   # 프론트엔드 TS 설정
└── ecosystem.config.js # PM2 설정 파일
```

## 🏃 실행 방법

### 사전 준비
1. 각 디렉토리(`backend`, `frontend`)에서 의존성을 설치합니다.
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. `backend/.env` 파일에 Supabase 환경 변수를 설정합니다.

### 개발 모드 (PM2 사용)
프로젝트 루트에서 다음 명령어를 실행하여 Backend와 Frontend를 동시에 실행합니다.
```bash
pm2 start ecosystem.config.js
```

### 개별 실행
- **Backend:** `cd backend && npm run dev`
- **Frontend:** `cd frontend && npm run dev`

## 🏗 빌드 방법
```bash
# Backend 빌드 (dist/ 폴더 생성)
cd backend && npm run build

# Frontend 빌드 (dist/ 폴더 생성)
cd frontend && npm run build
```
