import { AppState } from '../types';

export interface BalanceResult {
  person1Total: number;
  person2Total: number;
  total: number;
  difference: number;
  whoOwesWho: 'person1' | 'person2' | null;
  amountOwed: number;
}

export const calculateBalance = (state: AppState): BalanceResult => {
  let person1Total = 0;
  let person2Total = 0;

  state.expenses.forEach(expense => {
    if (expense.paidBy === 'person1') {
      person1Total += expense.amount;
    } else {
      person2Total += expense.amount;
    }
  });

  const total = person1Total + person2Total;
  const difference = Math.abs(person1Total - person2Total);
  const amountOwed = difference / 2;

  let whoOwesWho: 'person1' | 'person2' | null = null;
  if (person1Total > person2Total) {
    whoOwesWho = 'person2'; // person2 owes person1
  } else if (person2Total > person1Total) {
    whoOwesWho = 'person1'; // person1 owes person2
  }

  return {
    person1Total,
    person2Total,
    total,
    difference,
    whoOwesWho,
    amountOwed
  };
};
