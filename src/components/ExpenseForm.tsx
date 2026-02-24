import React, { useState } from 'react';
import { AppState, Expense } from '../types';
import { PlusCircle } from 'lucide-react';
import { CalculatorInput } from './CalculatorInput';

interface ExpenseFormProps {
  state: AppState;
  onAddExpense: (expense: Expense) => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ state, onAddExpense }) => {
  const [description, setDescription] = useState('');
  const [amountExpr, setAmountExpr] = useState('');
  const [amount, setAmount] = useState<number | null>(null);
  const [splitExpr, setSplitExpr] = useState('');
  const [splitAmount, setSplitAmount] = useState<number | null>(null);
  const [paidBy, setPaidBy] = useState<'person1' | 'person2'>('person1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const isValid = description.trim() && amount !== null && amount > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid || amount === null) return;

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description: description.trim(),
      amount,
      splitAmount: splitAmount !== null && splitAmount > 0 ? splitAmount : undefined,
      paidBy,
      date,
    };

    onAddExpense(newExpense);
    
    // Reset form
    setDescription('');
    setAmountExpr('');
    setAmount(null);
    setSplitExpr('');
    setSplitAmount(null);
  };

  const otherPerson = paidBy === 'person1' ? state.person2 : state.person1;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-blue-600" />
        支払いを追加
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            誰が支払いましたか？
          </label>
          <div className="flex rounded-lg overflow-hidden border border-gray-200">
            <button
              type="button"
              onClick={() => setPaidBy('person1')}
              className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                paidBy === 'person1'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {state.person1}
            </button>
            <button
              type="button"
              onClick={() => setPaidBy('person2')}
              className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                paidBy === 'person2'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {state.person2}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            内容
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="例: ランチ代"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            支払い金額 (円)
          </label>
          <p className="text-xs text-gray-400 mb-1.5">計算機で計算も可能です（例: 3000+1500）</p>
          <CalculatorInput
            value={amountExpr}
            onChange={setAmountExpr}
            onResult={setAmount}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {otherPerson} への請求額 (円)
            <span className="text-gray-400 font-normal ml-1">— 任意</span>
          </label>
          <p className="text-xs text-gray-400 mb-1.5">
            未入力の場合は半額（¥{amount ? Math.round(amount / 2).toLocaleString() : '—'}）になります
          </p>
          <CalculatorInput
            value={splitExpr}
            onChange={setSplitExpr}
            onResult={setSplitAmount}
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            日付
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed mt-2"
        >
          追加する
        </button>
      </form>
    </div>
  );
};
