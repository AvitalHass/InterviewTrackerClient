export type Interview = {
    id: string;
    company: string;
    role: string;
    date: string; // ISO 8601 date-time string
    interviewers?: {
      name: string;
      title: string;
    }[];
    type: string;
    questions?: string[];
    confident_answers?: string;
    challenging_questions?: string;
    strengths?: string;
    improvements?: string;
    connection?: string;
    comfort_level?: string;
    passed?: boolean;
    performance_rating?: number; // between 1 and 10
    notes?: string;
    status?: string;
    is_public?: boolean;
  };
  