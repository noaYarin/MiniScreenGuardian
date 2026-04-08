import { createAsyncThunk } from "@reduxjs/toolkit";
import * as parentApi from "@/src/api/parent";
import * as childApi from "@/src/api/child";
import type { Child } from "@/src/redux/slices/children-slice";

type AddChildPayload = {
  name: string;
  birthDate: string;
  gender?: string;
};

// Add 
export const addChildThunk = createAsyncThunk<
  any,
  AddChildPayload,
  { rejectValue: string }
>("children/addChild", async (payload, thunkAPI) => {
  try {
    const response = await parentApi.addChild(payload);
    if (response?.child == null) {
      return thunkAPI.rejectWithValue("children.add_failed");
    }
    return response.child;
  } catch (error) {
    const message =
      (error as Error)?.message ?? "children.add_failed";

    return thunkAPI.rejectWithValue(message);
  }
});

// Get all children
export const getMyChildrenThunk = createAsyncThunk<
  any[],
  void,
  { rejectValue: string }
>("children/getMyChildren", async (_, thunkAPI) => {
  try {
    const response = await parentApi.getMyChildren();
    const list = response?.children;
    return Array.isArray(list) ? list : [];
  } catch (error) {
    const message =
      (error as Error)?.message ?? "children.fetch_failed";

    return thunkAPI.rejectWithValue(message);
  }
});


export const deleteChildThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("children/deleteChild", async (childId, thunkAPI) => {
  try {
    await parentApi.deleteChild(childId);
    return childId;
  } catch (error) {
    const message =
      (error as Error)?.message ?? "children.delete_failed";

    return thunkAPI.rejectWithValue(message);
  }
});

// Get current child profile by id
export const fetchCurrentChildProfileThunk = createAsyncThunk<
  Child,// What we return
  void,// Payload - no parameters
  { rejectValue: string } // Reject value when the API returns an error
>("children/fetchCurrentChildProfile", async (_, thunkAPI) => {
  try {
    const response = await childApi.fetchCurrentChildProfile();
    if (response?.child == null) {
      return thunkAPI.rejectWithValue("children.profile_failed");
    }
    const raw = response.child;
    const child = {
      ...raw,
      _id: raw._id != null ? String(raw._id) : raw._id,
    };
    return child as Child;
  } catch (error) {
    const message =
      (error as Error)?.message ?? "children.profile_failed";
    return thunkAPI.rejectWithValue(message);
  }
});

// Update current child profile by id

export const updateCurrentChildProfileThunk = createAsyncThunk<
  Child, // What returned
  { childId: string; birthDate: string; gender: string }, // Payload
  { rejectValue: string }
>("children/updateCurrentChildProfile", async (payload, thunkAPI) => {
  try {
    const { childId, birthDate, gender } = payload;
    const response: any = await childApi.updateCurrentChildProfile(childId, birthDate, gender);
    const parentData = response.child; 
    const rawChild = parentData?.children?.find(
      (c: any) => String(c._id) === String(childId)
    );

    if (!rawChild) {
      return thunkAPI.rejectWithValue("children.profile_failed");
    }

    return {
      ...rawChild,
      _id: String(rawChild._id),
    } as Child;

  } catch (error) {
    return thunkAPI.rejectWithValue("children.profile_failed");
  }
});


export const updateChildProfileImageThunk = createAsyncThunk<
  Child,
  { childId: string; img: string },
  { rejectValue: string }
>("children/updateChildProfileImage", async ({ childId, img }, { rejectWithValue }) => {
  try {
    const response = await childApi.updateChildProfileImage(childId, img);
    const childData = response.child;

    if (!childData) {
      return rejectWithValue("children.profile_image_update_failed");
    }

    return {
      ...childData,
      _id: String((childData as Child)._id),
    } as Child;
  } catch (error) {
    return rejectWithValue(
      (error as Error)?.message ?? "children.profile_image_update_failed"
    );
  }
});