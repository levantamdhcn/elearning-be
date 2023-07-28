export class CreateCourseDto {
  title: string;
  description: string;
  file?: string;
  url?: string;
  image?: string;
  demand?: string[];
}
