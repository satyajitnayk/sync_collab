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
