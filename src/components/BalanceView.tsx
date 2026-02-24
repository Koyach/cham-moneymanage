import React from 'react';
import { AppState } from '../types';
import { calculateBalance } from '../utils/calculations';
import { Wallet, ArrowRight } from 'lucide-react';

interface BalanceViewProps {
  state: AppState;
}

export const BalanceView: React.FC<BalanceViewProps> = ({ state }) => {
  const balance = calculateBalance(state);

  const getOweMessage = () => {
    if (balance.amountOwed === 0) {
      return '精算は不要です';
    }

    const from = balance.whoOwesWho === 'person1' ? state.person1 : state.person2;
    const to = balance.whoOwesWho === 'person1' ? state.person2 : state.person1;

    return (
      <div className="flex items-center justify-center gap-3 text-lg font-medium text-gray-800">
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
          {from}
        </span>
        <ArrowRight className="w-5 h-5 text-gray-400" />
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          {to}
        </span>
        <span className="ml-2 font-bold text-xl">
          ¥{balance.amountOwed.toLocaleString()}
        </span>
      </div>
    );
  };

  // Calculate percentages for the bar chart
  const maxTotal = Math.max(balance.person1Total, balance.person2Total, 1); // Avoid division by zero
  const p1Percent = (balance.person1Total / maxTotal) * 100;
  const p2Percent = (balance.person2Total / maxTotal) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Wallet className="w-5 h-5 text-blue-600" />
        残高サマリー
      </h2>

      <div className="bg-gray-50 rounded-xl p-6 mb-8 text-center border border-gray-100">
        <p className="text-sm text-gray-500 mb-3">精算結果</p>
        {getOweMessage()}
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
            <span>{state.person1} の支払い合計</span>
            <span className="text-lg font-bold text-gray-900">¥{balance.person1Total.toLocaleString()}</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${p1Percent}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
            <span>{state.person2} の支払い合計</span>
            <span className="text-lg font-bold text-gray-900">¥{balance.person2Total.toLocaleString()}</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${p2Percent}%` }}
            ></div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-gray-500 font-medium">総支出</span>
          <span className="text-xl font-bold text-gray-900">¥{balance.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
