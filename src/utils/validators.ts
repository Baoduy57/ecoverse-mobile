import { REGEX } from '../constants/config';

// Validate email
export const validateEmail = (email: string): boolean => {
  return REGEX.EMAIL.test(email);
};

// Validate password
export const validatePassword = (password: string): boolean => {
  return REGEX.PASSWORD.test(password);
};

// Validate phone number
export const validatePhone = (phone: string): boolean => {
  return REGEX.PHONE.test(phone);
};

// Validate tên (không chứa số và ký tự đặc biệt)
export const validateName = (name: string): boolean => {
  return name.length >= 2 && /^[a-zA-ZÀ-ỹ\s]+$/.test(name);
};

// Check empty string
export const isEmpty = (value: string): boolean => {
  return !value || value.trim().length === 0;
};

// Validate form data
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateLoginForm = (email: string, password: string): ValidationResult => {
  const errors: Record<string, string> = {};

  if (isEmpty(email)) {
    errors.email = 'Email không được để trống';
  } else if (!validateEmail(email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (isEmpty(password)) {
    errors.password = 'Mật khẩu không được để trống';
  } else if (password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegisterForm = (
  email: string,
  password: string,
  confirmPassword: string,
  name: string
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (isEmpty(name)) {
    errors.name = 'Tên không được để trống';
  } else if (!validateName(name)) {
    errors.name = 'Tên không hợp lệ';
  }

  if (isEmpty(email)) {
    errors.email = 'Email không được để trống';
  } else if (!validateEmail(email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (isEmpty(password)) {
    errors.password = 'Mật khẩu không được để trống';
  } else if (password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  if (isEmpty(confirmPassword)) {
    errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Mật khẩu không khớp';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
