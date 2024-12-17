import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import News from './pages/News.jsx';
import Layout from './components/Layout.jsx';
import './index.css';
import Entertainment from './pages/Entertainment.jsx';
import Technology from './pages/Technology.jsx';
import PremiumLayout from './components/PremiumLayout.jsx';
import Profile from './components/Profile.jsx';
import Post from './components/Post.jsx';
import { ToastContainer, toast } from "react-toastify";
import { Provider } from "react-redux";
import store from './redux/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

let persistor = persistStore(store);

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '',
          element: <Home />,
        },
        {
          path: 'news',
          element: <News />,
        },
        {
          path: 'entertainment',
          element: <Entertainment />,
        },
        {
          path: 'tech',
          element: <Technology />,
        },
      ],
    },
    {
      path: 'premium',
      element: <PremiumLayout />,
      children: [
        {
          path: '',
          element: <Post />,
        },
        {
          path: 'profile/:id',
          element: <Profile />,
        },
      ],
    },
  ],
  {
    future: {
      v7_skipActionErrorRevalidation: true, // Opt-in to the new revalidation behavior
      v7_partialHydration: true, // Opt-in to the new partial hydration behavior
    },
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <RouterProvider router={router} />
        <ToastContainer position="top-center" autoClose={3000} />
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
