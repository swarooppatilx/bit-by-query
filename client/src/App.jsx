import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import LeaderBoard from "./LeaderBoard";
import CountDown from "./CountDown";
import NotFound from "./NotFound";
import Register from "./Register";
import Middleware from "./middleware";
import ForgotPassword from "./ForgotPassword";
import LandingPage from "./LandingPage";
import { Provider } from "react-redux";
import store from "./redux/store";
import HomePage from "./pages/HomePage"; 
import SQLPLatform from "./pages/SQLPlatform";
import Homepage from "./pages/HomePage";
import SQLPlatform from "./pages/SQLPlatform";
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
           <Route path="/platform" element={<SQLPlatform />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/countdown" element={<CountDown />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;