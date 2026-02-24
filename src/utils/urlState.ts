import { AppState } from '../types';

/** URL-safe Base64 エンコード（+ → -, / → _, = 除去） */
const toUrlSafeBase64 = (str: string): string => {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

/** URL-safe Base64 デコード */
const fromUrlSafeBase64 = (str: string): string => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // パディング復元
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  return atob(base64);
};

/** ルーム1つの状態を URL-safe Base64 エンコードして返す */
export const encodeStateToHash = (state: AppState): string => {
  try {
    const jsonString = JSON.stringify(state);
    return toUrlSafeBase64(encodeURIComponent(jsonString));
  } catch (error) {
    console.error('Failed to encode state:', error);
    return '';
  }
};

/** URL ハッシュから AppState をデコードする */
export const decodeStateFromUrl = (): AppState | null => {
  try {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith('#data=')) {
      return null;
    }

    const encoded = hash.replace('#data=', '');
    const jsonString = decodeURIComponent(fromUrlSafeBase64(encoded));
    return JSON.parse(jsonString) as AppState;
  } catch (error) {
    console.error('Failed to decode state:', error);
    return null;
  }
};

/** 指定したルームの共有用 URL を生成 */
export const generateShareUrl = (state: AppState): string => {
  const base = window.location.origin + window.location.pathname;
  const hash = encodeStateToHash(state);
  return `${base}#data=${hash}`;
};
