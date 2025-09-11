import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { ToastContainer } from "react-toastify";

import store from "./redux/store.js";
import Layout from "./components/Layout.jsx";
import PremiumLayout from "./components/PremiumLayout.jsx";
import Home from "./pages/Home.jsx";
import News from "./pages/News.jsx";
import Entertainment from "./pages/Entertainment.jsx";
import Technology from "./pages/Technology.jsx";
import Post from "./components/Post.jsx";
import Profile from "./components/Profile.jsx";
import Notification from "./components/Notification.jsx";
import BookmarksPage from "./components/BookmarksPage.jsx";
import { SocketProvider } from "./context/SocketProvider";

import NotificationProvider from "./context/NotificationContext.jsx";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";

let persistor = persistStore(store);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "news", element: <News /> },
      { path: "entertainment", element: <Entertainment /> },
      { path: "tech", element: <Technology /> },
    ],
  },
  {
    path: "premium",
    element: <PremiumLayout />,
    children: [
      { path: "", element: <Post /> },
      { path: "profile/:id", element: <Profile /> },
      { path: "notifications", element: <Notification /> },
      { path: "bookmarks", element: <BookmarksPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SocketProvider>
          <NotificationProvider>
          <RouterProvider router={router} />
          <ToastContainer position="top-center" autoClose={3000} />
          </NotificationProvider>
        </SocketProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
