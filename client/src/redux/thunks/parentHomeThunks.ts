import { createAsyncThunk } from "@reduxjs/toolkit";
import { getHomeSummary, type HomeSummaryChild } from "@/src/api/parent";

export const fetchParentHomeSummaryThunk = createAsyncThunk<
  HomeSummaryChild[],
  void,
  { rejectValue: string }
>("parentHome/fetchSummary", async (_, thunkAPI) => {
  try {
    const response = await getHomeSummary();
    return Array.isArray(response.children) ? response.children : [];
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.message ?? "homeParent.fetch_summary_failed"
    );
  }
});