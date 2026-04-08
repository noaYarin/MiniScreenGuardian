import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiLoginParent,
  apiRegisterParent,
  apiResetPassword,
  apiForgotPassword,
  apiGenerateCodeForPairingChild,
  apiLinkDevice,
  apiLogoutParent,
} from "../../api/auth";

// Payload when auth succeeds (login, register, reset password)
type AuthSuccessPayload = {
  token: string;
  parentId: string;
};

// Reset password args are defined inline so it's clear what the thunk expects
type ResetPasswordArgs = {
  email: string;
  otpCode: string;
  password: string;
};

// Forgot password returns only a success message
type ForgotPasswordSuccessPayload = {
  message: string;
};

/* AuthSuccessPayload is the payload when auth succeeds,
{ email: string; password: string } is the credentials we send to the API.
{ rejectValue: string } is the reject value when the API returns an error.
*/
export const loginParent = createAsyncThunk<
  AuthSuccessPayload,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginParent", async (credentials, thunkAPI) => {
  try {
    const data = await apiLoginParent(credentials);
    return {
      token: data.token,
      parentId: data.parentId,
    };
  } catch (error) {
    const message =
      (error as Error)?.message ?? "loginParent.generic_error";

    return thunkAPI.rejectWithValue(message);
  }
});

export const registerParent = createAsyncThunk<
  AuthSuccessPayload,
  { email: string; password: string },
  { rejectValue: string }
>("auth/registerParent", async (credentials, thunkAPI) => {
  try {
    // Go to fulfilled state
    const data = await apiRegisterParent(credentials);
    return {
      token: data.token,
      parentId: data.parentId,
    };
  } catch (error) {
    // Go to rejected state
    const message =
      (error as Error)?.message ?? "registerParent.generic_error";

    return thunkAPI.rejectWithValue(message);
  }
});

export const forgotPassword = createAsyncThunk<
  ForgotPasswordSuccessPayload,
  string,
  { rejectValue: string }
>("auth/forgotPassword", async (email, thunkAPI) => {
  try {
    // Go to fulfilled state
    const data = await apiForgotPassword(email); 
    return data;
  } catch (error) {
    // Go to rejected state
    const message =
    (error as Error)?.message ?? "forgotPassword.generic_error";

  return thunkAPI.rejectWithValue(message);
  }
});

export const resetPassword = createAsyncThunk<
  AuthSuccessPayload,
  ResetPasswordArgs,
  { rejectValue: string }
>("auth/resetPassword", async (args, thunkAPI) => {
  try {
    // Go to fulfilled state
    const data = await apiResetPassword(args);
    return {
      token: data.token,
      parentId: data.parentId,
    };
  } catch (error) {
    // Go to rejected state
    const message =
      (error as Error)?.message ?? "resetPassword.generic_error";

    return thunkAPI.rejectWithValue(message);
  }
});

// Auth for children
export const generateCodeForPairingChild = createAsyncThunk<
  { code: string; barcodeToken: string; expiresAt: string },  
  { parentId: string; childId: string },
  { rejectValue: string }
>("auth/generateCodeForPairingChild", async (body, thunkAPI) => {
  try {
    const data = await apiGenerateCodeForPairingChild(body);
    return data;
  } catch (error) {
    const message =
      (error as Error)?.message ?? "pairingChild.generic_error";

    return thunkAPI.rejectWithValue(message);
  }
});


export const linkDevice = createAsyncThunk<
  {
    childToken: string;
    parentId: string;
    childId: string;
    deviceId: string;
    physicalId?: string;
  },
  { code: string; barcodeToken: string; deviceName: string; deviceType: string; platform: string },
  { rejectValue: string }
>("auth/linkDevice", async (params, thunkAPI) => {
  try {
    const data = await apiLinkDevice(params);
    return data;
  } catch (error) {
    const message =
      (error as Error)?.message ?? "linkDevice.generic_error";
    return thunkAPI.rejectWithValue(message);
  }
});

// Secure server-side logout so other devices get revoked too.
export const logoutParent = createAsyncThunk<
  { message?: string },
  void,
  { rejectValue: string }
>("auth/logoutParent", async (_: void, thunkAPI) => {
  try {
    const data = await apiLogoutParent();
    return { message: data?.message };
  } catch (error) {
    const message =
      (error as Error)?.message ?? "logoutParent.generic_error";
    return thunkAPI.rejectWithValue(message);
  }
});


