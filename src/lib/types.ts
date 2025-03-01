// トピック（お題）の型定義
export type Topic = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  answers?: Answer[];
};

// 回答の型定義
export type Answer = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  topicId: string;
  topic?: Topic;
  score: number;
  isSelected: boolean;
};

// トピック作成用の型
export type CreateTopicInput = {
  content: string;
};

// 回答作成用の型
export type CreateAnswerInput = {
  content: string;
  topicId: string;
};

// API応答の型
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
}; 