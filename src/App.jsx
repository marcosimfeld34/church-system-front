import { Routes, Route } from "react-router-dom";

// components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./components/common/Home";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PersistLogin from "./components/auth/PersistLogin";
// import NewPasswordForm from "./components/NewPasswordForm";
// import ForgotPasswordForm from "./components/ForgotPassword";

function App() {
  return (
    <div>
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/forgot-password" element={<ForgotPasswordForm />} /> */}
        {/* <Route path="/recovery-password/:token" element={<NewPasswordForm />} /> */}
        {/* private routes */}
        <Route element={<PersistLogin />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<Home />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
