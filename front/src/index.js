import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import CoursesPage from "../src/pages/CoursesPage";
import {BrowserRouter,Routes,Route} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/courses" element={<CoursesPage />} />
        </Routes>
    </BrowserRouter>
);
