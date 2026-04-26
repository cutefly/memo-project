<template>
  <div class="app-container">
    <!-- Sticky Header Section -->
    <header class="main-header">
      <div class="header-content">
        <div class="title-section">
          <h1>📝 Memos</h1>
          <p class="subtitle">Organize your thoughts with precision</p>
        </div>
        <div class="header-actions">
          <!-- Theme Toggle -->
          <div class="theme-selector">
            <button 
              v-for="mode in themeModes" 
              :key="mode.value"
              @click="setTheme(mode.value)"
              :class="['icon-btn', { active: currentTheme === mode.value }]"
              :title="mode.label"
            >
              <component :is="mode.icon" :size="18" />
            </button>
          </div>
          <button @click="openCreateModal" class="btn-primary">
            <PlusIcon :size="18" />
            New Memo
          </button>
        </div>
      </div>
    </header>

    <div class="main-content">
      <!-- Category Chips -->
      <div class="category-row">
        <button 
          v-for="cat in filterCategories" 
          :key="cat.value"
          @click="selectedFilter = cat.value"
          :class="['chip', { active: selectedFilter === cat.value }]"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Control Toolbar -->
      <div class="toolbar">
        <div class="search-wrapper">
          <SearchIcon class="search-icon" :size="18" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search memos..." 
            class="search-input"
          />
        </div>
        
        <div class="toolbar-actions">
          <select v-model="sortBy" class="select-input">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="content">A-Z</option>
          </select>

          <div class="view-toggle">
            <button 
              @click="viewMode = 'grid'" 
              :class="['icon-btn', { active: viewMode === 'grid' }]"
              title="Grid View"
            >
              <LayoutGridIcon :size="20" />
            </button>
            <button 
              @click="viewMode = 'list'" 
              :class="['icon-btn', { active: viewMode === 'list' }]"
              title="List View"
            >
              <ListIcon :size="20" />
            </button>
          </div>

          <button @click="fetchMemos" :disabled="loading" class="icon-btn" title="Refresh">
            <RotateCwIcon :size="20" :class="{ 'spinning': loading }" />
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <main class="content-area">
        <div v-if="loading && memos.length === 0" class="loading-state">
          <div class="spinner"></div>
          <p>Loading your memos...</p>
        </div>

        <div v-else-if="processedMemos.length === 0" class="empty-state">
          <InboxIcon :size="48" />
          <p>No memos found matching your criteria.</p>
        </div>

        <div v-else :class="['memo-display', viewMode]">
          <div
            v-for="memo in processedMemos"
            :key="memo.id"
            class="memo-card"
            @click="startEdit(memo)"
          >
            <div class="card-header">
              <span class="category-tag" :class="getCategoryClass(memo.category)">
                {{ memo.category }}
              </span>
              <div class="card-actions" @click.stop>
                <button @click="deleteMemo(memo.id)" class="action-btn delete" title="Delete">
                  <Trash2Icon :size="16" />
                </button>
              </div>
            </div>
            
            <div class="card-body">
              <p class="content-text">{{ memo.content }}</p>
            </div>
            
            <div class="card-footer">
              <span class="date-text">
                <ClockIcon :size="12" />
                {{ formatDate(memo.created_at) }}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Form Modal -->
    <Transition name="fade">
      <div v-if="isFormModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ editingMemo ? 'Edit Memo' : 'Create New Memo' }}</h2>
            <button @click="closeModal" class="icon-btn"><XIcon :size="20" /></button>
          </div>
          
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Category</label>
              <div class="category-selector">
                <button 
                  v-for="cat in categories" 
                  :key="cat"
                  type="button"
                  @click="form.category = cat"
                  :class="['chip', { active: form.category === cat }]"
                >
                  {{ cat }}
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label>Content</label>
              <textarea
                v-model="form.content"
                placeholder="What's on your mind?"
                required
                rows="6"
                autofocus
              ></textarea>
            </div>
            
            <div class="modal-footer">
              <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
              <button type="submit" :disabled="loading" class="btn-primary">
                {{ editingMemo ? 'Save Changes' : 'Create Memo' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { 
  PlusIcon, SearchIcon, LayoutGridIcon, ListIcon, 
  RotateCwIcon, Trash2Icon, ClockIcon, XIcon, InboxIcon,
  SunIcon, MoonIcon, LaptopIcon
} from 'lucide-vue-next'

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

type ThemeMode = 'light' | 'dark' | 'system';

// State
const loading = ref(false)
const memos = ref<Memo[]>([])
const selectedFilter = ref('all')
const searchQuery = ref('')
const sortBy = ref('newest')
const viewMode = ref('grid')
const isFormModalOpen = ref(false)
const currentTheme = ref<ThemeMode>((localStorage.getItem('memo-theme') as ThemeMode) || 'system')

const themeModes = [
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'system', label: 'System', icon: LaptopIcon }
]

const categories = ['일반', '개발', '쇼핑', '기타']
const filterCategories = [
  { value: 'all', label: 'All' },
  { value: '일반', label: 'General' },
  { value: '개발', label: 'Code' },
  { value: '쇼핑', label: 'Shop' },
  { value: '기타', label: 'Other' }
]

const form = ref<MemoForm>({
  content: '',
  category: '일반'
})
const editingMemo = ref<Memo | null>(null)

// Theme Management Logic
function setTheme(theme: ThemeMode) {
  currentTheme.value = theme
  localStorage.setItem('memo-theme', theme)
  applyTheme()
}

function applyTheme() {
  const root = document.documentElement
  let isDark = false

  if (currentTheme.value === 'system') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  } else {
    isDark = currentTheme.value === 'dark'
  }

  if (isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

// Watch for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (currentTheme.value === 'system') applyTheme()
})

// Computed: Filtered and Sorted Memos
const processedMemos = computed(() => {
  let result = [...memos.value]
  if (selectedFilter.value !== 'all') {
    result = result.filter(m => m.category === selectedFilter.value)
  }
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(m => m.content.toLowerCase().includes(query))
  }
  result.sort((a, b) => {
    if (sortBy.value === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    if (sortBy.value === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    return a.content.localeCompare(b.content)
  })
  return result
})

// Methods
const API_URL = '/api/memos'

async function fetchMemos() {
  try {
    loading.value = true
    const response = await axios.get<Memo[]>(API_URL)
    memos.value = response.data
  } catch (error) {
    console.error('Fetch error:', error)
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  if (!form.value.content.trim()) return
  try {
    loading.value = true
    if (editingMemo.value) {
      const response = await axios.put<Memo>(`${API_URL}/${editingMemo.value.id}`, form.value)
      const index = memos.value.findIndex(m => m.id === editingMemo.value!.id)
      if (index !== -1) memos.value[index] = response.data
    } else {
      const response = await axios.post<Memo>(API_URL, form.value)
      memos.value.unshift(response.data)
    }
    closeModal()
  } catch (error) {
    console.error('Save error:', error)
  } finally {
    loading.value = false
  }
}

async function deleteMemo(id: string) {
  if (!confirm('Are you sure you want to delete this memo?')) return
  try {
    await axios.delete(`${API_URL}/${id}`)
    memos.value = memos.value.filter(m => m.id !== id)
  } catch (error) {
    console.error('Delete error:', error)
  }
}

function startEdit(memo: Memo) {
  editingMemo.value = memo
  form.value = { content: memo.content, category: memo.category }
  isFormModalOpen.value = true
}

function openCreateModal() {
  editingMemo.value = null
  form.value = { content: '', category: '일반' }
  isFormModalOpen.value = true
}

function closeModal() {
  isFormModalOpen.value = false
  editingMemo.value = null
}

function getCategoryClass(category: string) {
  const map: Record<string, string> = {
    '개발': 'cat-code',
    '쇼핑': 'cat-shop',
    '일반': 'cat-general',
    '기타': 'cat-other'
  }
  return map[category] || 'cat-other'
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  applyTheme()
  fetchMemos()
})
</script>

<style scoped>
.app-container {
  color: var(--text-main);
}

/* Sticky Header */
.main-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--bg-header);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  margin-bottom: 32px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-section h1 {
  font-size: 1.5rem;
  font-weight: 800;
}

.subtitle {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.main-content {
  padding-top: 8px;
}

/* Theme Selector */
.theme-selector {
  display: flex;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  padding: 2px;
}

.theme-selector .icon-btn {
  padding: 6px;
  border-radius: 6px;
}

.theme-selector .icon-btn.active {
  background: var(--border);
  color: var(--accent);
}

/* Chips */
.category-row {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.chip {
  padding: 6px 16px;
  border-radius: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-muted);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.chip:hover {
  border-color: var(--text-muted);
  color: var(--text-main);
}

.chip.active {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  align-items: center;
}

.search-wrapper {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.search-input {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px 10px 40px;
  color: var(--text-main);
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: var(--accent);
}

.toolbar-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.select-input {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-main);
  padding: 8px 12px;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
}

.view-toggle {
  display: flex;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  padding: 2px;
}

.icon-btn {
  padding: 8px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.icon-btn:hover {
  color: var(--text-main);
}

.icon-btn.active {
  color: var(--accent);
}

/* Memo Display */
.memo-display.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.memo-display.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.memo-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.memo-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.dark .memo-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.category-tag {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.cat-code { background: rgba(59, 130, 246, 0.1); color: #60a5fa; }
.cat-shop { background: rgba(16, 185, 129, 0.1); color: #34d399; }
.cat-general { background: rgba(139, 92, 246, 0.1); color: #a78bfa; }
.cat-other { background: rgba(107, 114, 128, 0.1); color: #9ca3af; }

.action-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.action-btn:hover.delete {
  color: var(--danger);
  background: rgba(239, 68, 68, 0.1);
}

.card-body {
  flex: 1;
  margin-bottom: 16px;
}

.content-text {
  font-size: 1rem;
  color: var(--text-main);
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-wrap;
}

.list .content-text {
  -webkit-line-clamp: 1;
}

.card-footer {
  display: flex;
  align-items: center;
}

.date-text {
  font-size: 0.8rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--modal-overlay);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  padding: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.category-selector {
  display: flex;
  gap: 10px;
}

textarea {
  width: 100%;
  background: var(--bg-main);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  color: var(--text-main);
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  outline: none;
}

textarea:focus {
  border-color: var(--accent);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}

/* Buttons */
.btn-primary {
  background: var(--accent);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: var(--accent-hover);
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-main);
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover {
  background: var(--border);
}

/* Utilities */
.loading-state, .empty-state {
  text-align: center;
  padding: 80px 0;
  color: var(--text-muted);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--accent);
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 1s linear infinite;
}

.dark .spinner {
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinning {
  animation: spin 1s linear infinite;
}

@media (max-width: 640px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  .toolbar-actions {
    justify-content: space-between;
  }
}
</style>
