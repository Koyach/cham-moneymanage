import React, { useState } from 'react';
import { Room } from '../types';
import { calculateBalance } from '../utils/calculations';
import { Plus, Users, Trash2, ArrowRight, ChevronRight } from 'lucide-react';

interface RoomListProps {
  rooms: Room[];
  onSelectRoom: (roomId: string) => void;
  onCreateRoom: (person1: string, person2: string) => void;
  onDeleteRoom: (roomId: string) => void;
}

export const RoomList: React.FC<RoomListProps> = ({
  rooms,
  onSelectRoom,
  onCreateRoom,
  onDeleteRoom,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [person1, setPerson1] = useState('');
  const [person2, setPerson2] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (person1.trim() && person2.trim()) {
      onCreateRoom(person1.trim(), person2.trim());
      setPerson1('');
      setPerson2('');
      setShowForm(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    if (window.confirm('このルームを削除しますか？')) {
      onDeleteRoom(roomId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">割り勘・立替管理</h1>
            <p className="text-sm text-gray-500 mt-1">ペアを選択するか、新しく作成しましょう</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新規ペア
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Create Room Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6 animate-in">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              新しいペアを作成
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!person1.trim() || !person2.trim()}
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  作成する
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="py-2 px-6 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Room List */}
        {rooms.length === 0 && !showForm ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">ペアがまだありません</p>
            <p className="text-gray-400 text-sm mb-6">「新規ペア」ボタンから作成してください</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              最初のペアを作成
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {rooms.map((room) => {
              const balance = calculateBalance(room.state);
              return (
                <div
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-gray-800">
                          {room.state.person1}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="text-lg font-bold text-gray-800">
                          {room.state.person2}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{room.state.expenses.length} 件の支払い</span>
                        <span>総額 ¥{balance.total.toLocaleString()}</span>
                        {balance.amountOwed > 0 && (
                          <span className="text-orange-600 font-medium">
                            精算額 ¥{balance.amountOwed.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDelete(e, room.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="削除"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
