<template>
  <div class="app">
    <header class="card text-center mb-6">
      <h1>📝 카테고리 메모 앱</h1>
      <p class="mb-4">카테고리별로 메모를 정리하세요</p>
    </header>

    <main>
      <!-- 메모 작성 폼 -->
      <div class="card mb-6">
        <h2 class="mb-4">{{ editingMemo ? '메모 수정' : '새 메모 작성' }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
            <div class="flex gap-2 mb-4">
              <button 
                v-for="cat in categories" 
                :key="cat"
                type="button"
                @click="form.category = cat"
                :class="[
                  'px-4 py-2 rounded-lg transition-all',
                  form.category === cat 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ cat }}
              </button>
            </div>
          </div>
          <div class="mb-4">
            <textarea
              v-model="form.content"
              placeholder="메모 내용을 입력하세요..."
              required
              class="w-full"
              rows="4"
            ></textarea>
          </div>
          <div class="flex gap-4">
            <button type="submit" :disabled="loading" class="primary">
              <span v-if="loading" class="loading"></span>
              {{ editingMemo ? '수정 완료' : '메모 저장' }}
            </button>
            <button v-if="editingMemo" type="button" @click="cancelEdit" class="secondary">
              취소
            </button>
          </div>
        </form>
      </div>

      <!-- 카테고리 필터 및 메모 목록 -->
      <div class="card">
        <div class="flex justify-between items-center mb-6">
          <div class="flex gap-2">
            <button 
              v-for="cat in filterCategories" 
              :key="cat.value"
              @click="selectedFilter = cat.value"
              :class="[
                'px-4 py-2 rounded-lg transition-all text-sm',
                selectedFilter === cat.value 
                  ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ cat.label }}
            </button>
          </div>
          <button @click="fetchMemos" :disabled="loading" class="secondary">
            <span v-if="loading" class="loading"></span>
            새로고침
          </button>
        </div>

        <div v-if="loading && memos.length === 0" class="text-center py-8">
          <div class="loading mx-auto mb-4" style="border-top-color: #667eea;"></div>
          <p>메모를 불러오는 중...</p>
        </div>

        <div v-else-if="filteredMemos.length === 0" class="text-center py-8">
          <p v-if="selectedFilter === 'all'">아직 작성된 메모가 없습니다. 첫 메모를 작성해보세요!</p>
          <p v-else>"{{ categories.find(c => c === selectedFilter) || selectedFilter }}" 카테고리에 메모가 없습니다.</p>
        </div>

        <div v-else class="memo-list">
          <div
            v-for="memo in filteredMemos"
            :key="memo.id"
            class="memo-item card mb-4"
            :class="{ 
              'editing': editingMemo?.id === memo.id,
              'border-l-4': true,
              'border-l-blue-500': memo.category === '개발',
              'border-l-green-500': memo.category === '쇼핑',
              'border-l-purple-500': memo.category === '일반',
              'border-l-gray-500': memo.category === '기타'
            }"
          >
            <div class="flex justify-between items-start mb-3">
              <div>
                <span class="category-badge" :class="getCategoryClass(memo.category)">
                  {{ memo.category }}
                </span>
              </div>
              <div class="flex gap-2">
                <button @click="startEdit(memo)" class="secondary" style="padding: 8px 16px;">
                  ✏️
                </button>
                <button @click="deleteMemo(memo.id)" class="danger" style="padding: 8px 16px;">
                  🗑️
                </button>
              </div>
            </div>
            <div class="mb-3">
              <p class="text-gray-800 whitespace-pre-wrap text-lg">{{ memo.content }}</p>
            </div>
            <div class="text-sm text-gray-400 flex justify-between">
              <span>생성: {{ formatDate(memo.created_at) }}</span>
              <span v-if="memo.updated_at">수정: {{ formatDate(memo.updated_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// Types
interface Memo {
  id: string;
  content: string;
  category: string;
  created_at: string;
  updated_at?: string;
}

interface MemoForm {
  content: string;
  category: string;
}

const loading = ref(false)
const memos = ref<Memo[]>([])
const form = ref<MemoForm>({
  content: '',
  category: '일반'
})
const editingMemo = ref<Memo | null>(null)
const selectedFilter = ref('all')

const categories = ['일반', '개발', '쇼핑', '기타']
const filterCategories = [
  { value: 'all', label: '전체' },
  { value: '일반', label: '일반' },
  { value: '개발', label: '개발' },
  { value: '쇼핑', label: '쇼핑' },
  { value: '기타', label: '기타' }
]

// 필터링된 메모
const filteredMemos = computed(() => {
  if (selectedFilter.value === 'all') return memos.value
  return memos.value.filter(memo => memo.category === selectedFilter.value)
})

// 카테고리 클래스 반환
function getCategoryClass(category: string) {
  const classes: Record<string, string> = {
    '개발': 'bg-blue-100 text-blue-800',
    '쇼핑': 'bg-green-100 text-green-800',
    '일반': 'bg-purple-100 text-purple-800',
    '기타': 'bg-gray-100 text-gray-800'
  }
  return classes[category] || 'bg-gray-100 text-gray-800'
}

// API URL (Relative for production, absolute for dev if needed)
const API_URL = '/api/memos'

// 메모 불러오기
async function fetchMemos() {
  try {
    loading.value = true
    const response = await axios.get<Memo[]>(API_URL)
    memos.value = response.data
  } catch (error) {
    console.error('메모 불러오기 오류:', error)
    alert('메모를 불러오는 중 오류가 발생했습니다.')
  } finally {
    loading.value = false
  }
}

// 메모 저장/수정
async function handleSubmit() {
  if (!form.value.content.trim()) {
    alert('메모 내용을 입력해주세요.')
    return
  }

  try {
    loading.value = true
    if (editingMemo.value) {
      // 수정
      const response = await axios.put<Memo>(`${API_URL}/${editingMemo.value.id}`, form.value)
      const index = memos.value.findIndex(m => m.id === editingMemo.value!.id)
      if (index !== -1) {
        memos.value[index] = response.data
      }
      cancelEdit()
    } else {
      // 새로 작성
      const response = await axios.post<Memo>(API_URL, form.value)
      memos.value.unshift(response.data)
    }
    
    form.value = { content: '', category: '일반' }
  } catch (error) {
    console.error('메모 저장 오류:', error)
    alert('메모 저장 중 오류가 발생했습니다.')
  } finally {
    loading.value = false
  }
}

// 메모 삭제
async function deleteMemo(id: string) {
  if (!confirm('정말 삭제하시겠습니까?')) return

  try {
    await axios.delete(`${API_URL}/${id}`)
    memos.value = memos.value.filter(m => m.id !== id)
  } catch (error) {
    console.error('메모 삭제 오류:', error)
    alert('메모 삭제 중 오류가 발생했습니다.')
  }
}

// 메모 수정 시작
function startEdit(memo: Memo) {
  editingMemo.value = memo
  form.value = {
    content: memo.content,
    category: memo.category || '일반'
  }
  document.querySelector('textarea')?.scrollIntoView({ behavior: 'smooth' })
}

// 수정 취소
function cancelEdit() {
  editingMemo.value = null
  form.value = { content: '', category: '일반' }
}

// 날짜 포맷팅
function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '방금 전'
  if (diffMins < 60) return `${diffMins}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays < 7) return `${diffDays}일 전`
  
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchMemos()
})
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-fill-color: transparent;
  margin-bottom: 0.5rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.category-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.memo-item {
  transition: all 0.3s ease;
}

.memo-item:hover {
  transform: translateX(4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.memo-item.editing {
  background-color: #fffbeb;
  border-left-color: #f59e0b !important;
}

button.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

button.secondary {
  background: #f1f5f9;
  color: #64748b;
}

button.danger {
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
  color: white;
}

.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .app {
    padding: 10px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .card {
    padding: 16px;
  }
  
  .flex {
    flex-direction: column;
    gap: 12px;
  }
  
  button {
    width: 100%;
  }
}
</style>