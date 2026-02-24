import React, { useState } from 'react';
import { Calculator, Delete, Check } from 'lucide-react';

interface CalculatorInputProps {
  value: string;
  onChange: (value: string) => void;
  onResult: (result: number) => void;
}

/** 数式を安全に評価する */
const safeEval = (expression: string): number | null => {
  try {
    // 数字、演算子、小数点、括弧のみ許可
    const sanitized = expression.replace(/[^0-9+\-*/().]/g, '');
    if (!sanitized) return null;
    // Function constructor で評価（eval より少し安全）
    const result = new Function(`return (${sanitized})`)() as number;
    if (typeof result !== 'number' || !isFinite(result) || result < 0) return null;
    return Math.round(result); // 整数に丸め
  } catch {
    return null;
  }
};

const BUTTONS = [
  ['7', '8', '9', '÷'],
  ['4', '5', '6', '×'],
  ['1', '2', '3', '-'],
  ['0', '00', '.', '+'],
] as const;

export const CalculatorInput: React.FC<CalculatorInputProps> = ({
  value,
  onChange,
  onResult,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expression, setExpression] = useState(value || '');

  const preview = safeEval(expression);

  const handleButtonClick = (btn: string) => {
    let char = btn;
    if (btn === '÷') char = '/';
    if (btn === '×') char = '*';
    const next = expression + char;
    setExpression(next);
    onChange(next);
  };

  const handleDelete = () => {
    const next = expression.slice(0, -1);
    setExpression(next);
    onChange(next);
  };

  const handleClear = () => {
    setExpression('');
    onChange('');
  };

  const handleConfirm = () => {
    if (preview !== null && preview > 0) {
      onResult(preview);
      setExpression(String(preview));
      onChange(String(preview));
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setExpression(val);
    onChange(val);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className="relative">
      {/* Expression Input */}
      <div className="relative">
        <input
          type="text"
          value={expression}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-mono text-right"
          placeholder="0"
          inputMode="decimal"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded transition-colors ${
            isOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Calculator className="w-4 h-4" />
        </button>
      </div>

      {/* Preview */}
      {expression && expression !== String(preview) && (
        <div className="mt-1 text-right text-sm">
          {preview !== null ? (
            <span className="text-green-600 font-medium">= ¥{preview.toLocaleString()}</span>
          ) : (
            <span className="text-gray-400">計算式を入力...</span>
          )}
        </div>
      )}

      {/* Calculator Pad */}
      {isOpen && (
        <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-3 space-y-2">
          {/* Action Buttons */}
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 py-2 text-sm font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              AC
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 py-2 text-sm font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <Delete className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                const next = expression + '(';
                setExpression(next);
                onChange(next);
              }}
              className="flex-1 py-2 text-sm font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              (
            </button>
            <button
              type="button"
              onClick={() => {
                const next = expression + ')';
                setExpression(next);
                onChange(next);
              }}
              className="flex-1 py-2 text-sm font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              )
            </button>
          </div>

          {/* Number & Operator Grid */}
          {BUTTONS.map((row, i) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              {row.map((btn) => {
                const isOp = ['÷', '×', '-', '+'].includes(btn);
                return (
                  <button
                    key={btn}
                    type="button"
                    onClick={() => handleButtonClick(btn)}
                    className={`py-3 text-base font-medium rounded-lg transition-colors ${
                      isOp
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {btn}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Confirm Button */}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={preview === null || preview <= 0}
            className="w-full mt-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            {preview !== null && preview > 0
              ? `¥${preview.toLocaleString()} で確定`
              : '金額を確定'}
          </button>
        </div>
      )}
    </div>
  );
};
