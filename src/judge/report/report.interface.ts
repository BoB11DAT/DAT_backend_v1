import { Double } from "typeorm";

export class ReportData {
  receipt_judge_number?: number;
  result_answer_correct?: boolean;
  judge_type?: number;
  judge_difficulty?: number;
  report_correct_answer_rate?: Double;
}
