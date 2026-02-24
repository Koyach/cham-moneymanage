import React from 'react';
import { AppState } from '../types';
import { Trash2, Receipt } from 'lucide-react';

interface ExpenseListProps {
  state: AppState;
  onDeleteExpense: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ state, onDeleteExpense }) => {
  if (state.expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">まだ支払い履歴がありません</p>
      </div>
    );
  }

  // Sort expenses by date descending
  const sortedExpenses = [...state.expenses].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-blue-600" />
          支払い履歴
        </h2>
      </div>
      
      <div className="divide-y divide-gray-100">
        {sortedExpenses.map((expense) => (
          <div key={expense.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-800">{expense.description}</span>
                <span className="font-semibold text-gray-900">
                  ¥{expense.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500 gap-3">
                <span>{expense.date}</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  {expense.paidBy === 'person1' ? state.person1 : state.person2} が支払い
                </span>
              </div>
            </div>
            
            <button
              onClick={() => onDeleteExpense(expense.id)}
              className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="削除"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
