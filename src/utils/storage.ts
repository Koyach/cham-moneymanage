import { Room, StorageData } from '../types';

const STORAGE_KEY = 'cham-moneymanage-data';

/** localStorage から全データを読み込み */
export const loadStorage = (): StorageData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { rooms: [] };
    return JSON.parse(raw) as StorageData;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return { rooms: [] };
  }
};

/** localStorage に全データを保存 */
export const saveStorage = (data: StorageData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

/** ルームを追加 */
export const addRoom = (room: Room): void => {
  const data = loadStorage();
  data.rooms.push(room);
  saveStorage(data);
};

/** ルームを更新 */
export const updateRoom = (room: Room): void => {
  const data = loadStorage();
  const index = data.rooms.findIndex((r) => r.id === room.id);
  if (index >= 0) {
    data.rooms[index] = { ...room, updatedAt: new Date().toISOString() };
  }
  saveStorage(data);
};

/** ルームを削除 */
export const deleteRoom = (roomId: string): void => {
  const data = loadStorage();
  data.rooms = data.rooms.filter((r) => r.id !== roomId);
  saveStorage(data);
};

/** ID でルームを取得 */
export const getRoom = (roomId: string): Room | undefined => {
  const data = loadStorage();
  return data.rooms.find((r) => r.id === roomId);
};

/** 全ルーム一覧を取得（更新日の降順） */
export const getAllRooms = (): Room[] => {
  const data = loadStorage();
  return data.rooms.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
};
