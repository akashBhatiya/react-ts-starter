import { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import PrivateRoute from './components/PrivateRoute'
import * as Types from './Types'


function App() {

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-[#242424]">
            <div className="w-16 h-16 border-4 border-[#2e5442] border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Routes>
            {routes.map((route: Types.RouteType) => {
              if (route.children) {
                return (
                  <Route key={route.path} path={route.path} element={
                    route.isPrivate ?
                      <PrivateRoute element={route.element} /> :
                      <route.element />
                  }>
                    {route.children.map((child: Types.RouteType) => (
                      <Route
                        key={child.path}
                        path={child.path}
                        element={
                          child.isPrivate ?
                            <PrivateRoute element={child.element} /> :
                            <child.element />
                        }
                      />
                    ))}
                  </Route>
                );
              }

              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    route.isPrivate ?
                      <PrivateRoute element={route.element} /> :
                      <route.element />
                  }
                />
              );
            })}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
