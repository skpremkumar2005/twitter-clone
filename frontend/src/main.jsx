import React, { useEffect } from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
  } from '@tanstack/react-query'
  const queryClient = new QueryClient({
    defaultOptions:{
      queries:{
        refetchOnWindowFocus:false
      }
    }
  })
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((reg) => console.log('✅ Service Worker registered', reg))
        .catch((err) => console.error('❌ Service Worker registration failed:', err));
    }
  }, []);
  
  
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter> <App /></BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
