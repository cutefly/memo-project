const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // 현재 디렉토리의 .env 파일 사용

const app = express();
const port = process.env.BACKEND_PORT || 3000;

// Supabase Client 초기화
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL 또는 Anon Key가 설정되지 않았습니다. .env 파일을 확인해주세요.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to set CORS headers (for frontend on different origin)
app.use((req, res, next) => {
  const allowedOrigins = ['http://run.club012.com', 'https://run.club012.com', 'http://localhost:4001', 'http://192.168.219.40:4001'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // OPTIONS 요청에 대한 성공 응답
  }
  next();
});

// --- API Endpoints ---

// GET /api/memos - 모든 메모 조회
app.get('/api/memos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '메모 조회 중 오류 발생', details: error.message });
  }
});

// POST /api/memos - 새 메모 추가
app.post('/api/memos', async (req, res) => {
  const { content, category = '일반' } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: '메모 내용을 입력해주세요.' });
  }
  
  // 카테고리 유효성 검사
  const validCategories = ['일반', '개발', '쇼핑', '기타'];
  const selectedCategory = validCategories.includes(category) ? category : '일반';

  try {
    const { data, error } = await supabase
      .from('memos')
      .insert([{ 
        content, 
        category: selectedCategory, 
        created_at: new Date().toISOString() 
      }])
      .select();
    
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: '메모 추가 중 오류 발생', details: error.message });
  }
});

// PUT /api/memos/:id - 메모 수정
app.put('/api/memos/:id', async (req, res) => {
  const { id } = req.params;
  const { content, category } = req.body;
  
  if (!content && category === undefined) {
    return res.status(400).json({ error: '수정할 내용을 입력해주세요.' });
  }

  const updatePayload = {};
  if (content) updatePayload.content = content;
  if (category !== undefined) {
    // 카테고리 유효성 검사
    const validCategories = ['일반', '개발', '쇼핑', '기타'];
    updatePayload.category = validCategories.includes(category) ? category : '일반';
  }

  try {
    const { data, error } = await supabase
      .from('memos')
      .update(updatePayload)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    if (data.length === 0) return res.status(404).json({ error: '해당 ID의 메모를 찾을 수 없습니다.' });
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: '메모 수정 중 오류 발생', details: error.message });
  }
});

// DELETE /api/memos/:id - 메모 삭제
app.delete('/api/memos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('memos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: '메모 삭제 중 오류 발생', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Backend API server listening on port ${port}`);
});