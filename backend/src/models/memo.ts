export interface Memo {
  id: string;
  content: string;
  category: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateMemoDto {
  content: string;
  category?: string;
}

export interface UpdateMemoDto {
  content?: string;
  category?: string;
}
