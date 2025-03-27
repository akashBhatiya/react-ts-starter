import { lazy } from 'react'

import Login from '../pages/Login'
const Home = lazy(() => import('../pages/Home'))


export const routes = [
  {
    path: '/',
    element: Home,  // This component will be loaded only when needed
    isPrivate: true,
  },
  {
    path: '/login',
    element: Login,
    isPrivate: false,
  }
] 