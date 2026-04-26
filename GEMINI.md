# 📝 Modern TypeScript Memo App Project Standards

본 문서는 이 프로젝트의 현대적 TypeScript 아키텍처 및 개발 표준을 정의합니다. 모든 AI 에이전트와 개발자는 이 지침을 최우선으로 준수해야 합니다.

## 🏗 프로젝트 아키텍처 전략

### 1. Unified Type System (공통 타입 시스템)
- **Shared Types:** Backend와 Frontend에서 공통으로 사용하는 모델(Memo, Category 등)은 별도의 타입 정의 파일로 관리하여 데이터 정합성을 보장합니다.
- **Type Safety:** `any` 사용을 엄격히 금지하며, API 응답 및 요청에 명시적인 인터페이스를 적용합니다.

### 2. Backend (Express + TypeScript)
- **Runtime:** `tsx` 또는 `ts-node`를 사용하여 컴파일 없이 개발 환경을 구축합니다.
- **Validation:** `zod` 또는 `yup`과 같은 스키마 검증 라이브러리를 사용하여 런타임 타입 안전성을 확보합니다.

### 3. Frontend (Vue 3 + Vite + TypeScript)
- **Composition API:** 모든 컴포넌트는 `<script setup lang="ts">` 스타일을 사용합니다.
- **Theme System:** CSS Variables와 `.dark` 클래스를 활용한 **Light, Dark, System** 테마 시스템을 유지합니다. 색상은 반드시 정의된 변수(`--bg-main`, `--text-main` 등)를 사용합니다.
- **Icons:** 모든 아이콘은 `lucide-vue-next` 라이브러리를 표준으로 사용합니다.

## 🎨 UI/UX 디자인 원칙 (OpenRouter Inspired)

### 1. Layout & Aesthetic
- **Models Framework:** 모든 메인 조회 인터페이스는 OpenRouter의 "Models" 프레임 스타일(중앙 집중형 레이아웃, 통합 툴바)을 따릅니다.
- **Glassmorphism:** 헤더 및 주요 오버레이는 스티키(Sticky) 속성과 `backdrop-filter: blur()` 효과를 적용하여 현대적인 깊이감을 제공합니다.
- **Background:** 미세한 그리드 패턴 배경(Grid Pattern)을 유지하여 공간의 가시성을 확보합니다.

### 2. Interaction Design
- **Modal-First:** 데이터 생성, 수정 등 복잡한 입력 폼은 메인 목록의 맥락을 유지할 수 있도록 모달(Modal) 창을 통해 처리합니다.
- **View Modes:** 데이터 성격에 따라 사용자가 그리드(Grid)와 리스트(List) 뷰를 전환할 수 있는 기능을 제공합니다.
- **Computed Pipeline:** 검색, 필터링, 정렬 로직은 연쇄적인 `computed` 프로퍼티를 사용하여 데이터 가공의 투명성을 유지합니다.

## 🛠 코딩 표준 및 컨벤션

### 1. Naming & Structure
- **Files:** 컴포넌트는 `PascalCase.vue`, 일반 스크립트는 `camelCase.ts`를 사용합니다.
- **Functions:** 서술적인 이름을 사용하며(예: `fetchMemos` 대신 `loadMemosFromServer`), 명확한 리턴 타입을 명시합니다.

### 2. Error Handling
- Backend: 중앙 집중식 에러 핸들러 미들웨어를 구축합니다.
- Frontend: `try-catch` 블록과 사용자 알림(Toast/Alert)을 결합하여 우아한 실패 처리를 구현합니다.

## 🚀 개발 워크플로우

1. **Research:** 기능 추가 전 기존 타입 정의 및 UI 변수를 확인합니다.
2. **Implementation:** 테마 변수와 일관된 UI 프레임을 사용하여 기능을 구현합니다.
3. **Validation:** `npm run build`를 통해 빌드 무결성과 타입 오류를 확인합니다.

---

> "Types are the blueprint of reliability, and UI consistency is the bridge to our users."
