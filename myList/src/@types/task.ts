export type FlagType = "baixa" | "media" | "alta";

export interface Task {
  item: number;
  title: string;
  description: string;
  timeLimit: string;
  flag: FlagType;
}
