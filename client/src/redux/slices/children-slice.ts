import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  addChildThunk,
  getMyChildrenThunk,
  fetchCurrentChildProfileThunk,
  updateCurrentChildProfileThunk,
  updateChildProfileImageThunk,
  deleteChildThunk,
} from "../thunks/childrenThunks";

export type ChildGender = "boy" | "girl" | "other";
export type ChildRole = "CHILD" | "PARENT";

export type ChildAvatar = {
  level?: number;
  img?: string;
  currentXp?: number;
  nextLevelXp?: number;
};

export type Child = {
  _id: string;
  name: string;
  img?: string;
  birthDate?: string;
  gender?: ChildGender;
  interests?: string[];
  coins: number;
  isActive: boolean;
  role: ChildRole;
  achievementIds?: string[];
  avatar?: ChildAvatar;
};

type ChildrenState = {
  childrenList: Child[];
  isLoading: boolean;
  error: string | null;
};

const initialState: ChildrenState = {
  childrenList: [],
  isLoading: false,
  error: null,
};

const childrenSlice = createSlice({
  name: "children",
  initialState,
  reducers: {
    setChildrenError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearChildrenError(state) {
      state.error = null;
    },
    clearChildrenList(state) {
      state.childrenList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addChildThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addChildThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.childrenList.push(action.payload);
      })
      .addCase(addChildThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Could not add the child.";
      })

      .addCase(getMyChildrenThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyChildrenThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.childrenList = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getMyChildrenThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Could not load children.";
      })

      .addCase(deleteChildThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteChildThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.childrenList = state.childrenList.filter(
          (child) => String(child._id) !== String(action.payload)
        );
      })
      .addCase(deleteChildThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Could not delete the child.";
      })

      .addCase(fetchCurrentChildProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentChildProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const child = action.payload;
        const idx = state.childrenList.findIndex(
          (c) => String(c._id) === String(child._id)
        );

        if (idx >= 0) {
          state.childrenList[idx] = child as Child;
        } else {
          state.childrenList.push(child as Child);
        }
      })
      .addCase(fetchCurrentChildProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Could not load the child profile.";
      })

      .addCase(updateCurrentChildProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCurrentChildProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedChild = action.payload;

        state.childrenList = state.childrenList.map((child) =>
          child._id === updatedChild._id ? updatedChild : child
        );
      })
      .addCase(updateCurrentChildProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Could not update the child profile.";
      })

      .addCase(updateChildProfileImageThunk.fulfilled, (state, action) => {
        const updatedChild = action.payload;
        state.childrenList = state.childrenList.map((c) =>
          String(c._id) === String(updatedChild._id) ? updatedChild : c
        );
      });
  },
});

export const { setChildrenError, clearChildrenError, clearChildrenList } =
  childrenSlice.actions;

export default childrenSlice.reducer;