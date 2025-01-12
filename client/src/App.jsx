import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import NotFound from "./NotFound";
import Middleware from "./middleware";

function App() {
  return (
    <Router>
      <Routes>
        {/* Apply middleware logic */}
        <Route
          path="/"
          element={
            <Middleware>
              <div /> {/* Empty route for middleware redirection */}
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
          path="/home"
          element={
            <Middleware>
              <Home />
            </Middleware>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
