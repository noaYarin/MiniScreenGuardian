const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_REGEX = /^\d{6}$/;

const check = {
  isEmpty(value: string): boolean {
    return !value || !value.trim();
  },
  isEmail(value: string): boolean {
    return EMAIL_REGEX.test(value.trim());
  },
  isPassword(value: string, minLength = 8): boolean {
    return value.length >= minLength;
  },
  isOtp(value: string): boolean {
    return OTP_REGEX.test(value.trim());
  },
  match(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  },
};

export function validateLogin(email: string, password: string): string | null {
  if (check.isEmpty(email) && check.isEmpty(password)) {
    return "loginParent.missing_fields";
  }
  if (!check.isEmail(email)) {
    return "loginParent.invalid_email";
  }
  if (!check.isPassword(password)) {
    return "loginParent.invalid_password";
  }
  return null;
}

export function validateRegister(
  email: string,
  password: string,
  confirmPassword: string
): string | null {
  if (check.isEmpty(email) && check.isEmpty(password) && check.isEmpty(confirmPassword)) {
    return "registerParent.missing_fields";
  }
  if (!check.isEmail(email)) {
    return "registerParent.invalid_email";
  }
  if (!check.match(password, confirmPassword)) {
    return "registerParent.passwords_not_match";
  }
  if (!check.isPassword(password)) {
    return "registerParent.invalid_password";
  }
  if (!check.isPassword(confirmPassword)) {
    return "registerParent.invalid_confirm_password";
  }
  return null;
}

export function validateForgotPassword(email: string): string | null {
  if (!check.isEmail(email)) {
    return "loginParent.invalid_email";
  }
  return null;
}

export function validateResetPassword(
  email: string | undefined,
  code: string,
  password: string,
  confirmPassword: string
): string | null {
  if (!email) {
    return "resetPassword.missing_email";
  }
  if (!check.isOtp(code)) {
    return "resetPassword.invalid_code";
  }
  if (check.isEmpty(password) || check.isEmpty(confirmPassword)) {
    return "resetPassword.missing_fields";
  }
  if (!check.isPassword(password)) {
    return "resetPassword.invalid_password";
  }
  if (!check.match(password, confirmPassword)) {
    return "resetPassword.passwords_not_match";
  }
  return null;
}
