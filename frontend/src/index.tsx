/// <reference types="react/next" />
/// <reference types="react-dom/next" />

import { createRoot } from 'react-dom'

import App from './app'

const root = createRoot(document.getElementById('root')!)

root.render(<App />)
