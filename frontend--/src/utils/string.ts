/**
 * 문자열 관련 유틸리티 함수들
 */

/**
 * 텍스트를 지정된 길이로 자르고 말줄임표 추가
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * 텍스트에서 HTML 태그 제거
 */
export const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/**
 * 텍스트를 카멜케이스로 변환
 */
export const toCamelCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

/**
 * 텍스트를 파스칼케이스로 변환
 */
export const toPascalCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
      return word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

/**
 * 텍스트를 스네이크케이스로 변환
 */
export const toSnakeCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
};

/**
 * 텍스트를 케밥케이스로 변환
 */
export const toKebabCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
};

/**
 * 첫 글자를 대문자로 변환
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * 모든 단어의 첫 글자를 대문자로 변환
 */
export const capitalizeWords = (str: string): string => {
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

/**
 * 텍스트에서 특수문자 제거
 */
export const removeSpecialChars = (str: string): string => {
  return str.replace(/[^a-zA-Z0-9가-힣\s]/g, '');
};

/**
 * 텍스트에서 숫자만 추출
 */
export const extractNumbers = (str: string): string => {
  return str.replace(/\D/g, '');
};

/**
 * 텍스트가 이메일 형식인지 확인
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 텍스트가 URL 형식인지 확인
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
