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
import Premium from './pages/Premium.jsx';


const router = createBrowserRouter([
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
        path:'entertainment',
        element:<Entertainment/>
      },
      {
        path: 'tech',
        element:<Technology/>
      },
      
    ],
   
  },
  {
    path:'premium',
    element:<Premium/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App/>
    <RouterProvider router={router} />
    
  </React.StrictMode>
);

