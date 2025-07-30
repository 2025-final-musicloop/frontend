/**
 * 유효성 검사 관련 유틸리티 함수들
 */

/**
 * 필수 필드 검사
 */
export const isRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * 최소 길이 검사
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

/**
 * 최대 길이 검사
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

/**
 * 패스워드 강도 검사
 */
export const validatePassword = (
  password: string,
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('비밀번호는 최소 8자 이상이어야 합니다.');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('비밀번호는 대문자를 포함해야 합니다.');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('비밀번호는 소문자를 포함해야 합니다.');
  }

  if (!/\d/.test(password)) {
    errors.push('비밀번호는 숫자를 포함해야 합니다.');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('비밀번호는 특수문자를 포함해야 합니다.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 사용자명 유효성 검사
 */
export const validateUsername = (
  username: string,
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (username.length < 3) {
    errors.push('사용자명은 최소 3자 이상이어야 합니다.');
  }

  if (username.length > 20) {
    errors.push('사용자명은 최대 20자까지 가능합니다.');
  }

  if (!/^[a-zA-Z0-9가-힣_]+$/.test(username)) {
    errors.push('사용자명은 영문, 숫자, 한글, 언더스코어만 사용 가능합니다.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 이메일 유효성 검사
 */
export const validateEmail = (
  email: string,
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    errors.push('올바른 이메일 형식이 아닙니다.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 파일 크기 검사
 */
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * 파일 타입 검사
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * 음악 파일 유효성 검사
 */
export const validateMusicFile = (
  file: File,
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'];
  const maxSizeMB = 50;

  if (!validateFileType(file, allowedTypes)) {
    errors.push('지원하지 않는 파일 형식입니다. (MP3, WAV, OGG, M4A만 지원)');
  }

  if (!validateFileSize(file, maxSizeMB)) {
    errors.push(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 폼 데이터 유효성 검사
 */
export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, any>,
): {
  isValid: boolean;
  errors: Record<string, string[]>;
} => {
  const errors: Record<string, string[]> = {};
  let isValid = true;

  Object.keys(rules).forEach((field) => {
    const value = data[field];
    const fieldRules = rules[field];
    const fieldErrors: string[] = [];

    // 필수 필드 검사
    if (fieldRules.required && !isRequired(value)) {
      fieldErrors.push('이 필드는 필수입니다.');
    }

    // 최소 길이 검사
    if (fieldRules.minLength && typeof value === 'string') {
      if (!hasMinLength(value, fieldRules.minLength)) {
        fieldErrors.push(`최소 ${fieldRules.minLength}자 이상 입력해주세요.`);
      }
    }

    // 최대 길이 검사
    if (fieldRules.maxLength && typeof value === 'string') {
      if (!hasMaxLength(value, fieldRules.maxLength)) {
        fieldErrors.push(`최대 ${fieldRules.maxLength}자까지 입력 가능합니다.`);
      }
    }

    // 이메일 검사
    if (fieldRules.email && value) {
      const emailValidation = validateEmail(value);
      fieldErrors.push(...emailValidation.errors);
    }

    // 사용자명 검사
    if (fieldRules.username && value) {
      const usernameValidation = validateUsername(value);
      fieldErrors.push(...usernameValidation.errors);
    }

    // 패스워드 검사
    if (fieldRules.password && value) {
      const passwordValidation = validatePassword(value);
      fieldErrors.push(...passwordValidation.errors);
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
      isValid = false;
    }
  });

  return { isValid, errors };
};
