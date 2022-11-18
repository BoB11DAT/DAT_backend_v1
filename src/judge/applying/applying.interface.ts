export class Judge {
  applying_judge_id: number;
  judge_id: number;
  applying_judge_number: number;
  judge_category: number;
  judge_content: string;
}

export class ApplyingAnswer {
  applying_answer_id: number;
  applying_judge_number: number;
  applying_answer_vector: number;
  applying_answer: string;
}
