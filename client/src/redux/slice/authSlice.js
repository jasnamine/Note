import { createSlice } from "@reduxjs/toolkit";
import {
  forgotPassword,
  googleLogin,
  login,
  logout,
  register,
  resetPassword,
} from "../api/auth";

const initialState = {
  register: {
    loading: false,
    error: false,
    success: false,
    msg: null,
  },
  login: {
    loading: false,
    error: false,
    success: false,
    msg: null,
    token: null,
  },
  googleLogin: {
    loading: false,
    error: false,
    success: false,
    msg: null,
  },
  logout: {
    loading: false,
    error: false,
    success: false,
    msg: null,
  },
  forgotPassword: {
    loading: false,
    error: false,
    success: false,
    msg: null,
  },
  resetPassword: {
    loading: false,
    error: false,
    success: false,
    msg: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAccessToken: (state, action) => {
      state.login.token = action.payload;
    },
  },

  // register
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.register.loading = true;
        state.register.error = false;
        state.register.success = false;
        state.register.msg = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.register.loading = false;
        state.register.error = false;
        state.register.success = true;
        state.register.msg = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.register.loading = false;
        state.register.error = true;
        state.register.success = false;
        state.register.msg = action.payload;
      });

    // login
    builder
      .addCase(login.pending, (state) => {
        state.login.loading = true;
        state.login.success = false;
        state.login.error = false;
        state.login.msg = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.login.loading = false;
        state.login.error = false;
        state.login.success = true;
        state.login.msg = action.payload.DT;
        state.login.token = action.payload.DT.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.login.loading = false;
        state.login.error = true;
        state.login.success = false;
        state.login.msg = action.payload;
      });

    // google login
    builder
      .addCase(googleLogin.pending, (state) => {
        state.googleLogin.loading = true;
        state.googleLogin.success = false;
        state.googleLogin.error = false;
        state.googleLogin.msg = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.googleLogin.loading = false;
        state.googleLogin.error = false;
        state.googleLogin.success = true;
        state.googleLogin.msg = action.payload.DT;
        state.login.token = action.payload.DT.accessToken;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.googleLogin.loading = false;
        state.googleLogin.error = true;
        state.googleLogin.success = false;
        state.googleLogin.msg = action.payload;
      });

    // logout
    builder
      .addCase(logout.pending, (state) => {
        state.logout.loading = true;
        state.logout.error = false;
        state.logout.success = false;
        state.logout.msg = null;
      })

      .addCase(logout.fulfilled, (state, action) => {
        Object.assign(state, initialState); // reset tất cả field
      })

      .addCase(logout.rejected, (state, action) => {
        state.logout.loading = false;
        state.logout.error = true;
        state.logout.success = false;
        state.logout.msg = action.payload;
      });

    // forgot password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPassword.loading = true;
        state.forgotPassword.error = false;
        state.forgotPassword.success = false;
        state.forgotPassword.msg = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotPassword.loading = false;
        state.forgotPassword.error = false;
        state.forgotPassword.success = true;
        state.forgotPassword.msg = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPassword.loading = false;
        state.forgotPassword.error = true;
        state.forgotPassword.success = false;
        state.forgotPassword.msg = action.payload;
      });

    // reset password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.resetPassword.loading = true;
        state.resetPassword.error = false;
        state.resetPassword.success = false;
        state.resetPassword.msg = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPassword.loading = false;
        state.resetPassword.error = false;
        state.resetPassword.success = true;
        state.resetPassword.msg = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPassword.loading = false;
        state.resetPassword.error = true;
        state.resetPassword.success = false;
        state.resetPassword.msg = action.payload;
      });
  },
});

export const { updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
