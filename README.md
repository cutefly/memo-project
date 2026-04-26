# 📝 Modern TypeScript Memo App (OpenRouter Style)

현대적인 TypeScript 기술 스택과 OpenRouter의 "Models" 프레임 인터페이스를 반영한 세련된 메모 관리 애플리케이션입니다. Backend(Express)와 Frontend(Vue 3) 간의 통합 타입 시스템을 활용하여 안정적인 개발 환경을 제공합니다.

## ✨ 주요 기능

### 🎨 OpenRouter 스타일 UI/UX
- **Modern Interface:** OpenRouter의 "Models" 프레임을 벤치마킹한 전문가용 다크 테마 및 레이아웃.
- **Glassmorphism Header:** 블러 처리된 반투명 스티키 헤더를 통해 세련된 깊이감 구현.
- **Grid Background:** 미세한 그리드 패턴 배경으로 현대적이고 깔끔한 공간감 제공.
- **Theme System:** 사용자의 취향에 맞춘 **Dark, Light, System** 모드 완벽 지원 (localStorage 연동).

### 🔍 스마트 메모 관리
- **Integrated Control:** 검색, 정렬(최신순/오래된순/이름순), 뷰 전환(Grid/List)이 통합된 툴바.
- **Category Filtering:** 칩(Chip) 기반의 빠른 카테고리 필터링.
- **Dynamic View:** 한눈에 많은 정보를 보는 **Grid 모드**와 목록 위주의 **List 모드** 제공.
- **Modal Workflow:** 레이아웃을 해치지 않는 모달 기반의 메모 작성 및 수정 프로세스.

## 🛠 기술 스택

### Backend
- **Framework:** Express (v5)
- **Language:** TypeScript (v6)
- **Database:** Supabase (PostgreSQL)
- **Dev Tool:** `tsx` (Hot-reload 지원)

### Frontend
- **Framework:** Vue 3 (Composition API, `<script setup lang="ts">`)
- **Icons:** `lucide-vue-next` (전문가용 아이콘 라이브러리)
- **Styling:** CSS Variables 기반의 테마 시스템 및 현대적 인터랙션
- **Build Tool:** Vite (TypeScript v6)

## 📂 프로젝트 구조

```text
/
├── backend/            # Express 서버
│   ├── src/
│   │   ├── config/     # Supabase 설정
│   │   ├── controllers/# 비즈니스 로직
│   │   ├── models/     # 데이터 모델 정의
│   │   ├── routes/     # 라우팅 및 API 엔드포인트
│   │   └── index.ts    # 서버 엔트리 포인트
├── frontend/           # Vue 3 SPA
│   ├── src/
│   │   ├── App.vue     # 메인 UI 레이아웃 및 비즈니스 로직
│   │   ├── main.ts     # 앱 인스턴스 초기화
│   │   └── style.css   # 전역 테마 및 그리드 배경 시스템
└── ecosystem.config.js # PM2 통합 실행 설정
```

## 🏃 실행 방법

### 사전 준비
1. `backend`, `frontend` 각 디렉토리에서 의존성을 설치합니다.
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. `backend/.env` 파일에 Supabase API 키 및 URL을 설정합니다.

### 실행 (PM2 사용 권장)
프로젝트 루트에서 Backend와 Frontend를 동시에 실행합니다.
```bash
pm2 start ecosystem.config.js
```

### 개별 실행
- **Backend:** `npm run dev` (in /backend)
- **Frontend:** `npm run dev` (in /frontend)

## 🏗 빌드 및 프로덕션
```bash
# 전체 빌드
npm run build --prefix backend
npm run build --prefix frontend
```

---

> "단순한 메모 앱을 넘어, 개발자 도구와 같은 전문적인 UX를 지향합니다."
