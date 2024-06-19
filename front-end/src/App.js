import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import NewViewPage from "./pages/NewViewPage";
import EmailPage from "./pages/EmailPage";

function App() {
  const isAuthenticated = localStorage.getItem("token") !== null;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <HomePage />}
        />
        <Route
          path="upload"
          element={isAuthenticated ? <UploadPage /> : <Navigate to="/" />}
        />
        <Route
          path="view"
          element={isAuthenticated ? <NewViewPage /> : <Navigate to="/" />}
        />
        <Route
          path="*"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/" />}
        />

        <Route
          path="/emails"
          element={isAuthenticated ? <EmailPage /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
