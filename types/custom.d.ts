import { Session, User } from "@supabase/supabase-js";

interface systemMessage {
     question : string,
     description : string,
     code? : string,
     language? : string,
     difficulty? : "Easy" | "Medium" | "Hard",
     topics? : string[]
}

export interface Message {
  id: string;
  userMessage?: string ;
  botMessage? : string;
  system ?: systemMessage,
  questionResponse?: questionResponse;
  sender: "user" | "bot" | "system";
  timestamp: Date;
  isChat?: boolean;
}


export interface MessageBubbleProps {
  sessionId: string;
  message: Message;
  user_id : string,
  generatedHandler : () => void
}


export   interface Scrap {
      question: string,
      description: string,
    }

export  interface leetcodeData extends Scrap {
      code?: string,
      language?: string,
      difficulty?: string,
    }

export interface Question {
    id: number;
    question_name: string;
    question_description : string;
    tag: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    note : string;
    code?: string;
    solved?: boolean;
    userCode? : string
}

export interface DatabaseQuestion {
  question_name : string,
  question_description : string,
  note : string,
  code : string,
  userCode : string,
  solved : boolean,
  user_id : string
}

interface questionResponse {
  question_name: string;
  description: string;
  userCode: string;
  topic: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  solution_code: string;
  note: string;
  interview_tips: string[];
}

export interface InterviewQuestion {
  id: number
  question_name: string
  description: string
  usercode: string
  solution: string
  tips: string[]
  note: string
  difficulty: "Easy" | "Medium" | "Hard"
  topics: string[]
  created_at: string
  updated_at: string
}

export interface QuestionUpdate {
  id: string
  field: keyof InterviewQuestion
  value: any
}
