"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMemo = exports.updateMemo = exports.createMemo = exports.getMemos = void 0;
const supabase_js_1 = require("../config/supabase.js");
const getMemos = async (_req, res) => {
    try {
        const { data, error } = await supabase_js_1.supabase
            .from('memos')
            .select('*')
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: '메모 조회 중 오류 발생', details: error.message });
    }
};
exports.getMemos = getMemos;
const createMemo = async (req, res) => {
    const { content, category = '일반' } = req.body;
    if (!content) {
        return res.status(400).json({ error: '메모 내용을 입력해주세요.' });
    }
    const validCategories = ['일반', '개발', '쇼핑', '기타'];
    const selectedCategory = validCategories.includes(category) ? category : '일반';
    try {
        const { data, error } = await supabase_js_1.supabase
            .from('memos')
            .insert([{
                content,
                category: selectedCategory,
                created_at: new Date().toISOString()
            }])
            .select();
        if (error)
            throw error;
        res.status(201).json(data ? data[0] : null);
    }
    catch (error) {
        res.status(500).json({ error: '메모 추가 중 오류 발생', details: error.message });
    }
};
exports.createMemo = createMemo;
const updateMemo = async (req, res) => {
    const { id } = req.params;
    const { content, category } = req.body;
    if (!content && category === undefined) {
        return res.status(400).json({ error: '수정할 내용을 입력해주세요.' });
    }
    const updatePayload = {};
    if (content)
        updatePayload.content = content;
    if (category !== undefined) {
        const validCategories = ['일반', '개발', '쇼핑', '기타'];
        updatePayload.category = validCategories.includes(category) ? category : '일반';
    }
    updatePayload.updated_at = new Date().toISOString();
    try {
        const { data, error } = await supabase_js_1.supabase
            .from('memos')
            .update(updatePayload)
            .eq('id', id)
            .select();
        if (error)
            throw error;
        if (!data || data.length === 0)
            return res.status(404).json({ error: '해당 ID의 메모를 찾을 수 없습니다.' });
        res.json(data[0]);
    }
    catch (error) {
        res.status(500).json({ error: '메모 수정 중 오류 발생', details: error.message });
    }
};
exports.updateMemo = updateMemo;
const deleteMemo = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase_js_1.supabase
            .from('memos')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: '메모 삭제 중 오류 발생', details: error.message });
    }
};
exports.deleteMemo = deleteMemo;
