import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuditLog } from "../../api/audit";
import { fetchAuditLogsThunk } from "../thunks/auditThunks";

export type AuditFetchStatus = "idle" | "loading" | "succeeded" | "failed";

type AuditState = {
  logsByChildId: Record<string, AuditLog[]>;
  statusByChildId: Record<string, AuditFetchStatus>;
  errorByChildId: Record<string, string | null>;
};

const initialState: AuditState = {
  logsByChildId: {},
  statusByChildId: {},
  errorByChildId: {},
};

const auditSlice = createSlice({
  name: "audit",
  initialState,
  reducers: {
    clearAuditLogsForChild: (state, action: PayloadAction<string>) => {
      const childId = action.payload;
      delete state.logsByChildId[childId];
      delete state.statusByChildId[childId];
      delete state.errorByChildId[childId];
    },
    clearAllAuditLogs: (state) => {
      state.logsByChildId = {};
      state.statusByChildId = {};
      state.errorByChildId = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogsThunk.pending, (state, action) => {
        const childId = action.meta.arg;
        state.statusByChildId[childId] = "loading";
        state.errorByChildId[childId] = null;
      })
      .addCase(fetchAuditLogsThunk.fulfilled, (state, action) => {
        const { childId, logs } = action.payload;
        state.logsByChildId[childId] = logs;
        state.statusByChildId[childId] = "succeeded";
        state.errorByChildId[childId] = null;
      })
      .addCase(fetchAuditLogsThunk.rejected, (state, action) => {
        const childId = action.meta.arg;
        state.statusByChildId[childId] = "failed";
        state.errorByChildId[childId] =
          (action.payload as string) ??
          action.error.message ??
          "Could not load activity history.";
      });
  },
});

export const { clearAuditLogsForChild, clearAllAuditLogs } = auditSlice.actions;
export { fetchAuditLogsThunk } from "../thunks/auditThunks";
export default auditSlice.reducer;