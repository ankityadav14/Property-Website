import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { Route, Routes, BrowserRouter } from "react-router-dom";

import './style.css'
import './animation.css'
import axios from 'axios';

const Home = lazy(() => import('./views/home.jsx'));
const Login = lazy(() => import('./views/Login'));
const Properties = lazy(() => import('./views/Properties'));
const AddProperty = lazy(() => import('./views/AddProperty'));
const NotFound = lazy(() => import('./views/not-found'));
const PropertyDetails = lazy(() => import('./views/PropertyDetails'));
const About = lazy(() => import('./views/About'));
const Contact = lazy(() => import('./views/Contact'));
const SavedProperties = lazy(() => import('./views/SavedProperties'));


// Seting the default configuration for cookies for Axios
axios.defaults.withCredentials = true;


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Suspense fallback={<div className="route-loading" role="status">Loading page…</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/addproperty" element={<AddProperty />} />
        <Route path='/details' element={<PropertyDetails />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/saved' element={<SavedProperties />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
