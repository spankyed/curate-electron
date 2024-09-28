import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

function App() {
  return (
    <div className='App'>
      Hello World
    </div>
  )
}

// postMessage({ payload: 'removeLoading' }, '*')
