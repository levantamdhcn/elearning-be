import { ESubmissionLanguage } from '../constants/submission';

export class CreateSubmissionDto {
  _id?: string;
  user: string;
  exercise: string;
  language: ESubmissionLanguage;
  solution: string;
}
