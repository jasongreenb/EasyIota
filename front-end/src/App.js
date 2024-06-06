import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage"
import ViewPage from "./pages/ViewPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage/>}/>
        <Route path="upload" element={<UploadPage/>}/>
        <Route path="view" element={<ViewPage />} />


      </Routes>
    </BrowserRouter>
  )
}