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
    return "Please fill in all fields";
  }
  if (!check.isEmail(email)) {
    return "Please enter a valid email";
  }
  if (!check.isPassword(password)) {
    return "Password must be at least 8 characters long";
  }
  return null;
}

export function validateRegister(
  email: string,
  password: string,
  confirmPassword: string
): string | null {
  if (
    check.isEmpty(email) &&
    check.isEmpty(password) &&
    check.isEmpty(confirmPassword)
  ) {
    return "Please fill in all fields";
  }
  if (!check.isEmail(email)) {
    return "Invalid email address";
  }
  if (!check.match(password, confirmPassword)) {
    return "Passwords do not match";
  }
  if (!check.isPassword(password)) {
    return "Password must be at least 8 characters long";
  }
  if (!check.isPassword(confirmPassword)) {
    return "Confirm password must be at least 8 characters long";
  }
  return null;
}

export function validateForgotPassword(email: string): string | null {
  if (!check.isEmail(email)) {
    return "Please enter a valid email";
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
    return "Missing email. Please restart the reset process";
  }
  if (!check.isOtp(code)) {
    return "Please enter the 6-digit verification code";
  }
  if (check.isEmpty(password) || check.isEmpty(confirmPassword)) {
    return "Please fill in all fields";
  }
  if (!check.isPassword(password)) {
    return "Password must be at least 8 characters long";
  }
  if (!check.match(password, confirmPassword)) {
    return "Passwords do not match";
  }
  return null;
}