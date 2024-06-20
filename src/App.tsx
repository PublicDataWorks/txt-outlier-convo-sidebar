import type { ReactElement } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { LOGIN_PATH, LOGOUT_PATH } from './constants/routes'
import GoogleOauthPopup from './components/GoogleOauthPopup'
import Logout from './components/Logout'
import Home from './pages/Home'

export default function App(): ReactElement {
  const router = (
    <Routes>
      <Route path={LOGIN_PATH} element={<GoogleOauthPopup />} />
      <Route path={LOGOUT_PATH} element={<Logout />} />
      <Route path='*' element={<Home />} />
    </Routes>
  )
  return (
    <BrowserRouter>
      <div className='h-screen overflow-scroll bg-missive-background-color text-missive-text-color-a'>{router}</div>
    </BrowserRouter>
  )
}
