export interface Message {
  username: string;
  content: string;
}

export type Status =
  | 'New'
  | 'Backlog'
  | 'Spike'
  | 'Ready'
  | 'Progress'
  | 'In review'
  | 'Done'
  | 'Released';

export interface Data {
  id: number;
  content: string;
  status: Status;
}

export interface Place {
  id: number;
  name: string;
  description: string;
  imageId: string;
}

export interface Ball {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
}
export interface TextDocument {
  id: number;
  userId: number;
  createdAt: string; // Assuming createdAt and updatedAt are represented as strings
  updatedAt: string;
  content: string;
  fileName: string;
}
