import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import "./index.css";

import useAuth from "./useAuth";
import LoginPage from "./LoginPage";
import AdminPage from "./AdminPage";
import PublicPage from "./PublicPage";

/**
 * @typedef {Object} Review
 * @property {number} ID
 * @property {string} restaurant // name of restaurant
 * @property {string} rating // rating out of 5
 * @property {string} review // summary of review
 * @property {string} photo // url for photo
 */
function App() {
  const { token } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route
          path="/admin"
          element={token ? <AdminPage /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/login"
          element={token ? <Navigate to="/admin" /> : <LoginPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
