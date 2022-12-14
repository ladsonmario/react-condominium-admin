import { Suspense, lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Auth Pages
const Login = Loader(lazy(() => import('src/pages/Login')));
const Logout = Loader(lazy(() => import('src/pages/Logout')));

// Dashboard
const Dashboard = Loader(lazy(() => import('src/pages/Dashboard')));

//Pages
const Wall = Loader(lazy(() => import('src/pages/Wall')));
const Documents = Loader(lazy(() => import('src/pages/Documents')));
const Reservations = Loader(lazy(() => import('src/pages/Reservations')));
const Warnings = Loader(lazy(() => import('src/pages/Warnings')));
const FoundAndLost = Loader(lazy(() => import('src/pages/FoundAndLost')));

const Users = Loader(lazy(() => import('src/pages/Users')));
const CommonAreas = Loader(lazy(() => import('src/pages/CommonAreas')));
const Units = Loader(lazy(() => import('src/pages/Units')));

// Not Found Page
const Status404 = Loader(lazy(() => import('src/pages/Status404')));

const routes: RouteObject[] = [
  {
    path: '',
    element: <SidebarLayout />,
    children: [{ path: '/', element: <Dashboard /> }]
  },  
  { path: 'management', 
    element: <SidebarLayout />,
    children: [
      { path: 'wall', element: <Wall /> },
      { path: 'documents', element: <Documents /> },
      { path: 'reservations', element: <Reservations /> },
      { path: 'warnings', element: <Warnings /> },
      { path: 'foundandlost', element: <FoundAndLost /> }
    ]
  },
  {
    path: 'data',
    element: <SidebarLayout />,
    children: [
      { path: 'users', element: <Users /> },
      { path: 'commonareas', element: <CommonAreas /> },
      { path: 'units', element: <Units /> }
    ]
  },
  { path: '*', element: <Status404 /> }  
];

export const AuthRouter = () => {
  return useRoutes([
    { path: '/login',  element: <Login /> },
    { path: '/logout', element: <Logout /> }    
  ]);
}

export default routes;