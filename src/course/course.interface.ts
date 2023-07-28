export interface ICourse {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  views: number;
  hours: number;
  lectures: number;
  demand: [string];
}