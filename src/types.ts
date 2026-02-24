export interface Expense {
  id: string;
  description: string;
  amount: number;
  /** 相手に請求する金額（電卓で計算した結果）。未設定なら amount/2 */
  splitAmount?: number;
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
