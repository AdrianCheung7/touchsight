import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CONTRAST_KEY } from './teacher/Shell.tsx'

// Remembered high contrast applies to every screen, the explorer included.
try {
  if (localStorage.getItem(CONTRAST_KEY) === 'high') document.documentElement.dataset.contrast = 'high'
} catch {
  // storage blocked: default contrast
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
