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
    // Updates a child summary item from a real-time device status socket event
    updateChildSummaryFromSocket: (
      state,
      action: PayloadAction<{
        childId: string;
        isLocked?: boolean;
        status?: "good" | "warn" | "bad";
        usedTodayMinutes?: number;
        dailyLimitMinutes?: number;
        remainingMinutes?: number;
      }>
    ) => {
      const {
        childId,
        isLocked,
        status,
        usedTodayMinutes,
        dailyLimitMinutes,
        remainingMinutes,
      } = action.payload;

      const idx = state.childrenSummary.findIndex(
        (child) => String(child.childId) === String(childId)
      );

      if (idx < 0) return;

      const current = state.childrenSummary[idx];

      state.childrenSummary[idx] = {
        ...current,
        isLocked: isLocked ?? current.isLocked,
        status: status ?? current.status,
        usedTodayMinutes: usedTodayMinutes ?? current.usedTodayMinutes,
        dailyLimitMinutes: dailyLimitMinutes ?? current.dailyLimitMinutes,
        remainingMinutes: remainingMinutes ?? current.remainingMinutes,
      };
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
          (action.payload as string) ?? "Could not load the home summary.";
      });
  },
});

export const { setParentHomeRefreshing, clearParentHomeError, updateChildSummaryFromSocket,
} =
  parentHomeSlice.actions;

export default parentHomeSlice.reducer;