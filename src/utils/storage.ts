/**
 * 로컬 스토리지 관련 유틸리티 함수들
 */

/**
 * 로컬 스토리지에 데이터 저장
 */
export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('로컬 스토리지 저장 실패:', error);
  }
};

/**
 * 로컬 스토리지에서 데이터 가져오기
 */
export const getStorageItem = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue || null;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error('로컬 스토리지 읽기 실패:', error);
    return defaultValue || null;
  }
};

/**
 * 로컬 스토리지에서 데이터 삭제
 */
export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('로컬 스토리지 삭제 실패:', error);
  }
};

/**
 * 로컬 스토리지 전체 삭제
 */
export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('로컬 스토리지 전체 삭제 실패:', error);
  }
};

/**
 * 로컬 스토리지 키 존재 여부 확인
 */
export const hasStorageItem = (key: string): boolean => {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error('로컬 스토리지 키 확인 실패:', error);
    return false;
  }
};

/**
 * 로컬 스토리지 크기 확인
 */
export const getStorageSize = (): number => {
  try {
    let size = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length + key.length;
      }
    }
    return size;
  } catch (error) {
    console.error('로컬 스토리지 크기 확인 실패:', error);
    return 0;
  }
};

/**
 * 토큰 관련 스토리지 함수들
 */
export const setAccessToken = (token: string): void => {
  setStorageItem('accessToken', token);
};

export const getAccessToken = (): string | null => {
  return getStorageItem<string>('accessToken');
};

export const setRefreshToken = (token: string): void => {
  setStorageItem('refreshToken', token);
};

export const getRefreshToken = (): string | null => {
  return getStorageItem<string>('refreshToken');
};

export const removeTokens = (): void => {
  removeStorageItem('accessToken');
  removeStorageItem('refreshToken');
};

/**
 * 사용자 정보 관련 스토리지 함수들
 */
export const setUserData = (user: any): void => {
  setStorageItem('userData', user);
};

export const getUserData = (): any => {
  return getStorageItem('userData');
};

export const removeUserData = (): void => {
  removeStorageItem('userData');
};

/**
 * 설정 관련 스토리지 함수들
 */
export const setAppSettings = (settings: any): void => {
  setStorageItem('appSettings', settings);
};

export const getAppSettings = (): any => {
  return getStorageItem('appSettings', {});
};

/**
 * 임시 데이터 저장 (세션 스토리지)
 */
export const setSessionItem = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('세션 스토리지 저장 실패:', error);
  }
};

export const getSessionItem = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = sessionStorage.getItem(key);
    if (item === null) {
      return defaultValue || null;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error('세션 스토리지 읽기 실패:', error);
    return defaultValue || null;
  }
};

export const removeSessionItem = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('세션 스토리지 삭제 실패:', error);
  }
};
