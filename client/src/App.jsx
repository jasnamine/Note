import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

import ForgotPassword from "./pages/ForgotPassword/Forgotpassword";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import VerifyOTP from "./pages/ResetPassword/VerifyOTP";

import DrawingCanvas from "./components/Notes/DrawingCanvas";
import Archive from "./pages/Archive/Archive";
import Home from "./pages/Home/Home";
import LoginGoogleSuccess from "./pages/Login/LoginGoogleSuccess";
import Trash from "./pages/Trash/Trash";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";
import PrivateRoute from "./route/ProtectedRoute";
import { getMuiTheme } from "./theme";
import NotesByTag from "./pages/NotesByTag/NotesByTag";
import Notes from "./components/Notes/Notes";

function App() {
  const settings = useSelector((state) => state.user.userData?.settings);
  const theme = settings?.theme || "light";
  const lang = settings?.language || "en";
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={getMuiTheme(theme)}>
          <CssBaseline />
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify" element={<VerifyOTP />} />
              <Route
                path="/google-login-success"
                element={<LoginGoogleSuccess />}
              />

              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/trash" element={<Trash />} />
                <Route path="/draw/:noteId" element={<DrawingCanvas />} />
                <Route path="/tag/:tagName" element={<NotesByTag />} />
                <Route path="/notes" element={<Notes />} />
              </Route>
            </Routes>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
