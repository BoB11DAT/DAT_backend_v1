export class Objection {
  objection_title: string;
  objection_content: string;
}

export class CreateObjection {
  receipt_registration_number: string;
  receipt_judge_number: number;
  objection: Objection;
}
