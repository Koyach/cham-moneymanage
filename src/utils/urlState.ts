import { AppState } from '../types';

/** ルーム1つの状態を Base64 エンコードして URL ハッシュ用文字列を返す */
export const encodeStateToHash = (state: AppState): string => {
  try {
    const jsonString = JSON.stringify(state);
    const base64 = btoa(encodeURIComponent(jsonString));
    return base64;
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

    const base64 = hash.replace('#data=', '');
    const jsonString = decodeURIComponent(atob(base64));
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
