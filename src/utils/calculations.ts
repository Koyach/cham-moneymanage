import { AppState } from '../types';

export interface BalanceResult {
  person1Total: number;
  person2Total: number;
  total: number;
  /** person2 が person1 に払うべき額（マイナスなら逆方向） */
  netOwed: number;
  whoOwesWho: 'person1' | 'person2' | null;
  amountOwed: number;
}

/**
 * 精算計算
 * - splitAmount が設定されている場合はそれを「相手への請求額」として使用
 * - 未設定の場合は amount / 2 （従来の折半）
 */
export const calculateBalance = (state: AppState): BalanceResult => {
  let person1Total = 0;
  let person2Total = 0;

  // person2 → person1 への正味の借り（正ならperson2がperson1に払う）
  let netOwed = 0;

  state.expenses.forEach((expense) => {
    const split = expense.splitAmount ?? expense.amount / 2;

    if (expense.paidBy === 'person1') {
      person1Total += expense.amount;
      // person1 が払ったので person2 は split 分を person1 に返すべき
      netOwed += split;
    } else {
      person2Total += expense.amount;
      // person2 が払ったので person1 は split 分を person2 に返すべき
      netOwed -= split;
    }
  });

  const total = person1Total + person2Total;
  const amountOwed = Math.abs(Math.round(netOwed));

  let whoOwesWho: 'person1' | 'person2' | null = null;
  if (netOwed > 0) {
    whoOwesWho = 'person2'; // person2 が person1 に払う
  } else if (netOwed < 0) {
    whoOwesWho = 'person1'; // person1 が person2 に払う
  }

  return {
    person1Total,
    person2Total,
    total,
    netOwed,
    whoOwesWho,
    amountOwed,
  };
};
