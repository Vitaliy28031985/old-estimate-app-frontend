import { lazy, Suspense } from 'react';
import { Routes, Route } from "react-router-dom";
import { useSelector } from 'react-redux';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { selectIsLoggedIn } from './redux/auth/authSlice';

import Header from "./components/Header/Header";
import NotFoundPage from "./Pages/NotFoundPage/NotFoundPage";
import Loader from "./components/Loader/Loader";
import {PrivateRoute} from './routers/PrivateRoute';
import {PublicRouter} from './routers/PublicRoute';
import s from './App.module.scss';


const  Home = lazy(() => import('./Pages/Authorization/AuthorizationPage' /* webpackChunkName: "Authorization" */));

const Price = lazy(() => import('./Pages/Price/Price' /* webpackChunkName: "Price" */));
const Profile = lazy(() => import('./Pages/Profile/Profile' /* webpackChunkName: "Profile" */));
const Projects = lazy(() => import('./Pages/Projects/Projects' /* webpackChunkName: "Projects" */));
const ProjectPage = lazy(() => import('./Pages/ProjectPage/ProjectPage' /* webpackChunkName: "ProjectPage " */));
const Project = lazy(() => import('./Pages/ProjectPage/Project/Project' /* webpackChunkName: "Project" */));
const MaterialsPage = lazy(() => import('./Pages/ProjectPage/MaterialPage/MaterialPage' /* webpackChunkName: "MaterialsPage" */));
const Advances = lazy(() => import('./Pages/ProjectPage/AdvancesPage/AdvancesPage' /* webpackChunkName: "Advances" */));
const ProjectPrice = lazy(() => import('./Pages/ProjectPage/ProjectPricePage/ProjectPricePage' /* webpackChunkName: "ProjectPrice" */));
const LowProject = lazy(() => import('./Pages/ProjectPage/LowProjectPage/LowProjectPage' /* webpackChunkName: "LowProject" */));
const Settings = lazy(() => import('./Pages/SettingsPage/SettingsPage' /* webpackChunkName: "Settings" */));
const MassageAllow = lazy(() => import('./Pages/MassageAllow/MassageAllow' /* webpackChunkName: "MassageAllow" */));



function App() {
  const isAuthorization = useSelector(selectIsLoggedIn);
  return (
    <div className={s.body}>
    <div className={s.container}>
      <ToastContainer />
      {isAuthorization && ( <Header/>)}
      <Suspense fallback={( <Loader/>)}>
      <Routes>
         <Route path="/" element={<PublicRouter><Home /></PublicRouter>} />

         <Route path="/price" element={<PrivateRoute><Price /></PrivateRoute>} />
         <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
         <Route path="/projects" element={<PrivateRoute><Projects/></PrivateRoute>} />
         <Route path="/project/:id" element={<PrivateRoute><ProjectPage /></PrivateRoute>}>
            <Route index element={<PrivateRoute><Project /></PrivateRoute>} />
            <Route path="price" element={<PrivateRoute><ProjectPrice /></PrivateRoute>} />
            <Route path="low" element={<PrivateRoute><LowProject /></PrivateRoute>} />
            <Route path="materials" element={<PrivateRoute><MaterialsPage /></PrivateRoute>} />
            <Route path="advances" element={<PrivateRoute><Advances /></PrivateRoute>} />
          </Route>
         <Route path="/project/settings/:id" element={<PrivateRoute><Settings/></PrivateRoute>} />
         <Route path="/allow" element={<PrivateRoute><MassageAllow/></PrivateRoute>} />
        
       
        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
      </Suspense>
    </div>
    </div>
  );
}

export default App;
