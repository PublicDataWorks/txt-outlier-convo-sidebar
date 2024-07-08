import type { ReactElement } from 'react'
import { Route, Routes, HashRouter } from 'react-router-dom'
import { LOGIN_PATH, LOGOUT_PATH } from './constants/routes'
import GoogleOauthPopup from './components/GoogleOauthPopup'
import Logout from './components/Logout'
import Home from './pages/Home'
import PrivateRoute from './components/PrivateRoute'

export default function App(): ReactElement {
  const router = (
    <Routes>
      <Route path={LOGIN_PATH} element={<GoogleOauthPopup />} />
      <Route path={LOGOUT_PATH} element={<Logout />} />
      <Route path="*" element={<PrivateRoute> <Home /> </PrivateRoute>} />
    </Routes>
  )
  return (
    <HashRouter>
      <div
        className="h-screen overflow-y-scroll bg-missive-background-color text-missive-text-color-a missive-scroll">{router}
      </div>
    </HashRouter>
  )
}
