import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./Components/Header";
import Dashboard from "./Components/Dashboard";
import MakeComplaint from "./Components/MakeComplaint";
import RequestComplaint from "./Components/RequestComplaint";
import ServicesDone from "./Components/ServicesDone";
import Homepage from "./Components/HomePage";
import { UserProvider } from "./Components/UserContext";
import "./App.css";
import Signin from "./Login/Signin";
import Login from "./Login/login";
import EditProfile from "./Login/EditProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <UserProvider>
      <div>
        <ToastContainer draggable />
        <Router>
          <ConditionalHeader />
          <Routes>
            <Route path="/" element={<Homepage />} />
            {/* <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Signin />} /> */}
            <Route path="/home" element={<Dashboard />} />
            <Route path="/make-complaint" element={<MakeComplaint />} />
            <Route path="/request-complaint" element={<RequestComplaint />} />
            <Route path="/serviced" element={<ServicesDone />} />
            <Route path="/edit" element={<EditProfile />} />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
};

const ConditionalHeader = () => {
  const location = useLocation();
  // Check if the current path is not the homepage
  const shouldShowHeader = location.pathname !== "/";
  return shouldShowHeader ? <Header /> : null;
};

export default App;
