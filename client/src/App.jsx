import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import LeaderBoard from "./LeaderBoard";
import NotFound from "./NotFound";
import Register from "./Register";
import Middleware from "./middleware";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Middleware>
              <div />
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
        <Route
          path="/home"
          element={
            <Middleware>
              <Home />
            </Middleware>
          }
        />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
