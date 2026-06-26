import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import Library from "./pages/Library";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Páginas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Páginas protegidas — exigem login */}
          <Route
            path="/menu"
            element={
              <PrivateRoute>
                <Menu />
              </PrivateRoute>
            }
          />
          <Route
            path="/library"
            element={
              <PrivateRoute>
                <Library />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
