# 📝 Modern TypeScript Memo App Project Standards

본 문서는 이 프로젝트의 현대적 TypeScript 아키텍처 및 개발 표준을 정의합니다. 모든 AI 에이전트와 개발자는 이 지침을 최우선으로 준수해야 합니다.

## 🏗 프로젝트 아키텍처 전략

### 1. Unified Type System (공통 타입 시스템)
- **Shared Types:** Backend와 Frontend에서 공통으로 사용하는 모델(Memo, Category 등)은 별도의 타입 정의 파일로 관리하여 데이터 정합성을 보장합니다.
- **Type Safety:** `any` 사용을 엄격히 금지하며, API 응답 및 요청에 명시적인 인터페이스를 적용합니다.

### 2. Backend (Express + TypeScript)
- **Runtime:** `tsx` 또는 `ts-node`를 사용하여 컴파일 없이 개발 환경을 구축합니다.
- **Validation:** `zod` 또는 `yup`과 같은 스키마 검증 라이브러리를 사용하여 런타임 타입 안전성을 확보합니다.
- **Supabase Integration:** Supabase CLI를 통해 데이터베이스 스키마 기반의 타입을 자동 생성하여 사용합니다.

### 3. Frontend (Vue 3 + Vite + TypeScript)
- **Composition API:** 모든 컴포넌트는 `<script setup lang="ts">` 스타일을 사용합니다.
- **Props/Emits:** `defineProps<{ ... }>()` 및 `defineEmits<{ ... }>()`를 사용하여 컴파일 타임에 타입을 체크합니다.
- **Axios Wrapper:** API 호출 시 제네릭을 사용하여 리턴 타입을 보장합니다. `axios.get<Memo[]>(...)`

## 🎨 코딩 표준 및 컨벤션

### 1. Naming & Structure
- **Files:** 컴포넌트는 `PascalCase.vue`, 일반 스크립트는 `camelCase.ts`를 사용합니다.
- **Functions:** 서술적인 이름을 사용하며(예: `fetchMemos` 대신 `loadMemosFromServer`), 화살표 함수보다 명시적인 `function` 선언을 선호할 수 있습니다 (Context에 따라 유연하게 적용).
- **Enums vs Literal Types:** 확장성을 위해 상수 집합은 `const enum` 또는 `union string types`를 사용합니다.

### 2. Error Handling
- Backend: 중앙 집중식 에러 핸들러 미들웨어를 구축합니다.
- Frontend: `try-catch` 블록과 사용자 알림(Toast/Alert)을 결합하여 우아한 실패 처리를 구현합니다.

## 🛠 도구 및 설정 지향점

- **Strict Mode:** `tsconfig.json`의 `strict` 옵션은 반드시 `true`여야 합니다.
- **Linting:** ESLint와 Prettier를 결합하여 코드 스타일을 자동화합니다.
- **Tests:** Vitest를 사용하여 핵심 로직 및 컴포넌트 단위 테스트를 작성합니다.

## 🚀 개발 워크플로우

1. **Research:** 기능 추가 전 기존 타입 정의를 확인하고 필요한 스키마를 정의합니다.
2. **Implementation:** 타입을 먼저 정의(Type-First Development)한 후 로직을 구현합니다.
3. **Validation:** `tsc --noEmit`을 통해 빌드 전 타입 오류를 확인합니다.

---

> "Types are not just for documentation; they are the blueprint of our application's reliability."
