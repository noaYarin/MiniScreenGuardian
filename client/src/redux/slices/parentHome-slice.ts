import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { HomeSummaryChild } from "@/src/api/parent";
import { fetchParentHomeSummaryThunk } from "../thunks/parentHomeThunks";

type ParentHomeState = {
  childrenSummary: HomeSummaryChild[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
};

const initialState: ParentHomeState = {
  childrenSummary: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
};

const parentHomeSlice = createSlice({
  name: "parentHome",
  initialState,
  reducers: {
    setParentHomeRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
    clearParentHomeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParentHomeSummaryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchParentHomeSummaryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        state.childrenSummary = action.payload;
      })
      .addCase(fetchParentHomeSummaryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        state.error =
          (action.payload as string) ?? "homeParent.fetch_summary_failed";
      });
  },
});

export const { setParentHomeRefreshing, clearParentHomeError } =
  parentHomeSlice.actions;

export default parentHomeSlice.reducer;