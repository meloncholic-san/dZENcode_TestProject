import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../Layout/Layout.jsx";
import NotFound from "../NotFound/NotFound.jsx";

const MainPage = lazy(() => import("../../pages/MainPage/MainPage.jsx"));
const AuthPage = lazy(() => import("../../pages/AuthPage/AuthPage.jsx"));

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path='auth/:authType' element={<AuthPage />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
      <ToastContainer />
    </Suspense>
  );
}

export default App;
