import React, { useState } from 'react';

interface SetupScreenProps {
  onSetupComplete: (person1: string, person2: string) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onSetupComplete }) => {
  const [person1, setPerson1] = useState('');
  const [person2, setPerson2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (person1.trim() && person2.trim()) {
      onSetupComplete(person1.trim(), person2.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          割り勘・立替管理
        </h1>
        <p className="text-gray-600 text-center mb-8">
          2人の名前を入力して始めましょう
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="person1" className="block text-sm font-medium text-gray-700 mb-1">
              Person 1 の名前
            </label>
            <input
              type="text"
              id="person1"
              value={person1}
              onChange={(e) => setPerson1(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="例: 太郎"
              required
            />
          </div>

          <div>
            <label htmlFor="person2" className="block text-sm font-medium text-gray-700 mb-1">
              Person 2 の名前
            </label>
            <input
              type="text"
              id="person2"
              value={person2}
              onChange={(e) => setPerson2(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="例: 花子"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!person1.trim() || !person2.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            はじめる
          </button>
        </form>
      </div>
    </div>
  );
};
