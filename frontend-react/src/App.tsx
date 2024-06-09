import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import CreateAccount from "./pages/CreateAccount";
import VerifyAccount from "./pages/VerifyAccount";
import Home from "./pages/Home";
import ProfileInfo from "./pages/ProfileInfo";
import ProfilePassword from "./pages/ProfilePassword";
import Conversation from "./pages/Conversations";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/verify_account/:token" element={<VerifyAccount />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile-info" element={<ProfileInfo />} />
        <Route path="/profile-password" element={<ProfilePassword />} />
        <Route path="/conversation/:username" element={<Conversation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
