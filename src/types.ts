export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: 'person1' | 'person2';
  date: string;
}

/** 1つのペア（ルーム）の状態 */
export interface AppState {
  person1: string;
  person2: string;
  expenses: Expense[];
}

/** ルーム：ペアの管理単位 */
export interface Room {
  id: string;
  state: AppState;
  createdAt: string;
  updatedAt: string;
}

/** 全データ（localStorage に保存される） */
export interface StorageData {
  rooms: Room[];
}
