import React from 'react';
import CoursesPage from "../src/pages/CoursesPage";
import TestPage from "../src/pages/TestPage";
import HomePage from "../src/pages/HomePage";
import LoginPage from "../src/pages/LoginPage";
import RegisterPage from "../src/pages/RegisterPage";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import { AuthContextProvider } from '../src/contexts/AuthContext';
import AboutPage from "./pages/AboutPage";
import PersonalPage from "./pages/PersonalPage";

const App = () => {
  return(
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/user" element={<PersonalPage/>} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  )
};

export default App;