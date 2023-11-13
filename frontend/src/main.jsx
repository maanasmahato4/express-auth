import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import Layout from './Layout.jsx';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { AuthContextProvider } from "./context/auth.context.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider>
      <AuthContextProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </AuthContextProvider>
    </MantineProvider>
  </React.StrictMode>,
)
