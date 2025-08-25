import { Suspense } from 'react'
import './App.css'
import './assets/css/GlobalStyles.scss'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <Suspense>
      <Outlet />
    </Suspense>
  )
}

export default App
