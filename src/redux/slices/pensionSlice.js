import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URL, completelyUnknownError } from "../../constants";
import { errorFormatter } from "../../helpers";

const initialState = {
  loading: false,
  error: null,
  pensionData: null,
  lastUpdated: null,
};

// Helper function to filter out null/undefined values
const filterValidData = (data) => {
  if (!data || typeof data !== "object") return null;

  const filtered = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value !== null && value !== undefined) {
      if (typeof value === "object" && !Array.isArray(value)) {
        // Recursively filter nested objects
        const nestedFiltered = filterValidData(value);
        if (nestedFiltered && Object.keys(nestedFiltered).length > 0) {
          filtered[key] = nestedFiltered;
        }
      } else if (Array.isArray(value)) {
        // Filter arrays to remove null/undefined items
        const filteredArray = value.filter(
          (item) => item !== null && item !== undefined
        );
        if (filteredArray.length > 0) {
          filtered[key] = filteredArray;
        }
      } else {
        filtered[key] = value;
      }
    }
  });

  return Object.keys(filtered).length > 0 ? filtered : null;
};

export const calculatePension = createAsyncThunk(
  "pension/calculatePension",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/calculate_pension`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ user_data: userData }),
      });

      if (!res.ok) {
        throw new Error(errorFormatter(res.status));
      }

      const data = await res.json();

      // Filter out null/undefined values
      const filteredData = filterValidData(data);

      if (filteredData) {
        return filteredData;
      } else {
        throw new Error("Received empty or invalid data from server");
      }
    } catch (error) {
      console.error("ERROR IN ASYNC THUNK pension/calculatePension: ", error);
      return rejectWithValue(`Obliczanie emerytury nieudane: ${error.message}`);
    }
  }
);

const pensionSlice = createSlice({
  name: "pension",
  initialState,
  reducers: {
    clearPensionData(state) {
      state.pensionData = null;
      state.lastUpdated = null;
      state.error = null;
    },
    setPensionData(state, action) {
      // Allow manual setting of pension data (e.g., from navigation state)
      const filteredData = filterValidData(action.payload);
      if (filteredData) {
        state.pensionData = filteredData;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      }
    },
    acknowledgeError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculatePension.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculatePension.fulfilled, (state, action) => {
        state.loading = false;
        state.pensionData = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(calculatePension.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || completelyUnknownError;
      });
  },
});

export default pensionSlice.reducer;

export const { clearPensionData, setPensionData, acknowledgeError } =
  pensionSlice.actions;
