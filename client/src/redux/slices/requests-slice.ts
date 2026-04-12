import { createSlice } from "@reduxjs/toolkit";
import type { ParentExtensionRequest } from "../../api/requests";
import {
  fetchPendingRequestsThunk,
  decideRequestThunk,
  createRequestThunk,
  fetchMyRequestsThunk,
} from "../thunks/requestThunks";

type RequestsState = {
  pending: ParentExtensionRequest[];
  mine: ParentExtensionRequest[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pendingRequestsRefreshKey: number;
};

const initialState: RequestsState = {
  pending: [],
  mine: [],
  status: "idle",
  error: null,
  pendingRequestsRefreshKey: 0,
};

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    bumpPendingRequestsRefreshKey(state) {
      state.pendingRequestsRefreshKey += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingRequestsThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPendingRequestsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pending = action.payload;
        state.error = null;
      })
      .addCase(fetchPendingRequestsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) ??
          action.error.message ??
          "Something went wrong. Please try again.";
      })

      .addCase(fetchMyRequestsThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyRequestsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mine = action.payload;
        state.error = null;
      })
      .addCase(fetchMyRequestsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) ??
          action.error.message ??
          "Something went wrong. Please try again.";
      })

      .addCase(createRequestThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createRequestThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.mine.unshift(action.payload);
      })
      .addCase(createRequestThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) ??
          action.error.message ??
          "Something went wrong. Please try again.";
      })

      .addCase(decideRequestThunk.fulfilled, (state, action) => {
        state.pending = state.pending.filter(
          (req) => String(req._id) !== String(action.payload._id)
        );
      });
  },
});

export const { bumpPendingRequestsRefreshKey } = requestsSlice.actions;
export default requestsSlice.reducer;