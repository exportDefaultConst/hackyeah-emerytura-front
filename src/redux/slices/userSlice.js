import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URL, completelyUnknownError } from "../../constants";
import { errorFormatter } from "../../helpers";

const initialState = {
  loading: false,
  error: null,
  userData: null,
  JWTToken: null,
  desiredAmount: null,
  formData: null,
  postalCode: "", // Add postal code to state
};

export const login = createAsyncThunk(
  "user/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://192.168.100.2:8080/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      if (!res.ok) {
        throw new Error(errorFormatter(res.status));
      }

      const data = await res.json();
      if (data) return data;
    } catch (error) {
      console.error("ERROR IN ASYNC THUNK user/login: ", error);
      return rejectWithValue(`Logowanie nieudane: ${error.message}`);
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async ({ username, password, email }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      if (!res.ok) {
        throw new Error(errorFormatter(res.status));
      }

      const data = await res.json();
      if (data) return data;
    } catch (error) {
      console.error("ERROR IN ASYNC THUNK user/register: ", error);
      return rejectWithValue(`Rejestracja nieudana: ${error.message}`);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    forceSyntheticError(state) {
      state.error = action.payload;
    },
    forceSyntheticLoading(state) {
      state.loading = !state.loading;
    },
    acknowledgeError(state) {
      state.error = null;
    },
    logout(state) {
      state.userData = null;
    },
    changeDesiredAmount(state, action) {
      state.desiredAmount = action.payload;
    },
    saveFormData(state, action) {
      state.formData = action.payload;
    },
    savePostalCode(state, action) {
      state.postalCode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.JWTToken = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || completelyUnknownError;
      })

      // register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || completelyUnknownError;
      });
  },
});

export default userSlice.reducer;

// reducers, not extraReducers!
export const {
  forceSyntheticError,
  forceSyntheticLoading,
  acknowledgeError,
  logout,
  changeDesiredAmount,
  saveFormData,
  savePostalCode,
} = userSlice.actions;
