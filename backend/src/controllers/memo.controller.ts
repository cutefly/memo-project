import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { CreateMemoDto, UpdateMemoDto } from '../models/memo.js';

export const getMemos = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: '메모 조회 중 오류 발생', details: error.message });
  }
};

export const createMemo = async (req: Request, res: Response) => {
  const { content, category = '일반' }: CreateMemoDto = req.body;
  
  if (!content) {
    return res.status(400).json({ error: '메모 내용을 입력해주세요.' });
  }
  
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
    res.status(201).json(data ? data[0] : null);
  } catch (error: any) {
    res.status(500).json({ error: '메모 추가 중 오류 발생', details: error.message });
  }
};

export const updateMemo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, category }: UpdateMemoDto = req.body;
  
  if (!content && category === undefined) {
    return res.status(400).json({ error: '수정할 내용을 입력해주세요.' });
  }

  const updatePayload: any = {};
  if (content) updatePayload.content = content;
  if (category !== undefined) {
    const validCategories = ['일반', '개발', '쇼핑', '기타'];
    updatePayload.category = validCategories.includes(category) ? category : '일반';
  }
  updatePayload.updated_at = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from('memos')
      .update(updatePayload)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: '해당 ID의 메모를 찾을 수 없습니다.' });
    res.json(data[0]);
  } catch (error: any) {
    res.status(500).json({ error: '메모 수정 중 오류 발생', details: error.message });
  }
};

export const deleteMemo = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('memos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: '메모 삭제 중 오류 발생', details: error.message });
  }
};
