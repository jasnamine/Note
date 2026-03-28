import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import "./i18n";
import { setAccessToken, setOnTokenRefreshed } from "./redux/api/axiosWrapper";
import { updateAccessToken } from "./redux/slice/authSlice";
import { persistor, store } from "./redux/store";

const currentToken = store.getState()?.auth?.login?.token;
if (currentToken) {
  setAccessToken(currentToken);
  setOnTokenRefreshed((newToken) => {
    store.dispatch(updateAccessToken(newToken));
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
