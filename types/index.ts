export type QuestionType =
  | "text"
  | "email"
  | "multiple_choice"
  | "yes_no";

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  required: boolean;
  options: string[];
}

export interface Form {
  id: string;
  user_id: string;
  title: string;
  description: string;
  slug: string;
  questions: Question[];
  welcome_message: string;
  completion_message: string;
  primary_color: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  form_id: string;
  answers: Record<string, string>;
  created_at: string;
}