import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetPendingRequests,
  apiDecideRequest,
  apiCreateRequest,
  apiGetMyRequests,
  type ParentExtensionRequest,
} from "../../api/requests";


export const createRequestThunk = createAsyncThunk<
  ParentExtensionRequest,
  { deviceId: string; requestedMinutes: number; reason: string },
  { rejectValue: string }
>("requests/create", async ({ deviceId, requestedMinutes, reason }, thunkAPI) => {
  try {
    return await apiCreateRequest({
      deviceId,
      requestedMinutes,
      reason,
    });
  } catch (error) {
    return thunkAPI.rejectWithValue(
      (error as Error)?.message ?? "api.generic_error"
    );
  }
});

export const fetchMyRequestsThunk = createAsyncThunk<
  ParentExtensionRequest[],
  void,
  { rejectValue: string }
>("requests/fetchMine", async (_, thunkAPI) => {
  try {
    return await apiGetMyRequests();
  } catch (error) {
    return thunkAPI.rejectWithValue(
      (error as Error)?.message ?? "api.generic_error"
    );
  }
});


export const fetchPendingRequestsThunk = createAsyncThunk<
  ParentExtensionRequest[],
  { childId?: string },
  { rejectValue: string }
>("requests/fetchPending", async ({ childId }, thunkAPI) => {
  try {
    return await apiGetPendingRequests(childId);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      (error as Error)?.message ?? "api.generic_error"
    );
  }
});

export const decideRequestThunk = createAsyncThunk<
  ParentExtensionRequest,
  { requestId: string; decision: "APPROVED" | "REJECTED" },
  { rejectValue: string }
>("requests/decide", async ({ requestId, decision }, thunkAPI) => {
  try {
    return await apiDecideRequest(requestId, decision);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      (error as Error)?.message ?? "api.generic_error"
    );
  }
});