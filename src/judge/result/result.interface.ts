export class Result {
  receipt_registration_number: string;
  receipt_round: string;
  result_report: string;
}

export class Solution {
  applying_judge_number: number;
  judge_id: number;
  judge_content: string;
  judge_category: number;
  docdoc_url: string;
  result_answer_correct: boolean;
}

export class CheckAnswer {
  judge_id: number;
  answer: string;
}
