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

function App() {
  return (
    <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/home"
          element={
            <Middleware>
              <Home />
            </Middleware>
          }
        />
        <Route
          path="/login"
          element={
            <Middleware>
              <Login />
            </Middleware>
          }
        />
        <Route
          path="/register"
          element={
            <Middleware>
              <Register />
            </Middleware>
          }
        />
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
