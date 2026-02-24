import { useState, useEffect, useCallback } from 'react';
import { Room, Expense } from './types';
import { decodeStateFromUrl } from './utils/urlState';
import {
  getAllRooms,
  addRoom,
  updateRoom,
  deleteRoom as deleteRoomStorage,
} from './utils/storage';
import { RoomList } from './components/RoomList';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { BalanceView } from './components/BalanceView';
import { ShareButton } from './components/ShareButton';
import { Wallet, PlusCircle, Receipt, ArrowLeft } from 'lucide-react';

function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'balance' | 'add' | 'history'>('balance');

  // Load rooms from localStorage on mount, and import from URL if present
  useEffect(() => {
    const savedRooms = getAllRooms();
    setRooms(savedRooms);

    // If URL has shared data, import it as a new room
    const urlState = decodeStateFromUrl();
    if (urlState) {
      // Check if a room with same pair already exists
      const existing = savedRooms.find(
        (r) =>
          (r.state.person1 === urlState.person1 && r.state.person2 === urlState.person2) ||
          (r.state.person1 === urlState.person2 && r.state.person2 === urlState.person1)
      );
      if (existing) {
        // Merge: replace with URL data (URL is newer since it was shared)
        const updated: Room = {
          ...existing,
          state: urlState,
          updatedAt: new Date().toISOString(),
        };
        updateRoom(updated);
        setRooms(getAllRooms());
        setActiveRoomId(existing.id);
      } else {
        // Create new room from URL
        const newRoom: Room = {
          id: crypto.randomUUID(),
          state: urlState,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addRoom(newRoom);
        setRooms(getAllRooms());
        setActiveRoomId(newRoom.id);
      }
      // Clear the URL hash
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || null;

  const handleCreateRoom = useCallback((person1: string, person2: string) => {
    const newRoom: Room = {
      id: crypto.randomUUID(),
      state: { person1, person2, expenses: [] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addRoom(newRoom);
    setRooms(getAllRooms());
    setActiveRoomId(newRoom.id);
  }, []);

  const handleDeleteRoom = useCallback((roomId: string) => {
    deleteRoomStorage(roomId);
    setRooms(getAllRooms());
    if (activeRoomId === roomId) {
      setActiveRoomId(null);
    }
  }, [activeRoomId]);

  const handleSelectRoom = useCallback((roomId: string) => {
    setActiveRoomId(roomId);
    setActiveTab('balance');
  }, []);

  const handleBackToRooms = () => {
    setActiveRoomId(null);
  };

  const handleAddExpense = (expense: Expense) => {
    if (!activeRoom) return;
    const updated: Room = {
      ...activeRoom,
      state: {
        ...activeRoom.state,
        expenses: [...activeRoom.state.expenses, expense],
      },
      updatedAt: new Date().toISOString(),
    };
    updateRoom(updated);
    setRooms(getAllRooms());
    setActiveTab('history');
  };

  const handleDeleteExpense = (id: string) => {
    if (!activeRoom) return;
    const updated: Room = {
      ...activeRoom,
      state: {
        ...activeRoom.state,
        expenses: activeRoom.state.expenses.filter((e) => e.id !== id),
      },
      updatedAt: new Date().toISOString(),
    };
    updateRoom(updated);
    setRooms(getAllRooms());
  };

  // Room list screen
  if (!activeRoom) {
    return (
      <RoomList
        rooms={rooms}
        onSelectRoom={handleSelectRoom}
        onCreateRoom={handleCreateRoom}
        onDeleteRoom={handleDeleteRoom}
      />
    );
  }

  // Room detail screen
  const state = activeRoom.state;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToRooms}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="戻る"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">割り勘・立替管理</h1>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {state.person1} & {state.person2}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-3xl mx-auto px-4 flex border-t border-gray-100">
          <button
            onClick={() => setActiveTab('balance')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'balance'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Wallet className="w-4 h-4" />
            残高
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'add'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            追加
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Receipt className="w-4 h-4" />
            履歴
            {state.expenses.length > 0 && (
              <span className="bg-gray-100 text-gray-600 text-xs py-0.5 px-2 rounded-full">
                {state.expenses.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {activeTab === 'balance' && <BalanceView state={state} />}
        {activeTab === 'add' && <ExpenseForm state={state} onAddExpense={handleAddExpense} />}
        {activeTab === 'history' && <ExpenseList state={state} onDeleteExpense={handleDeleteExpense} />}
      </main>

      <ShareButton state={state} />
    </div>
  );
}

export default App;
