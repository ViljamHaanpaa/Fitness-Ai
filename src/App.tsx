import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Home } from "./screens/Home";
import { WorkoutProvider } from "./contexts/WorkoutContext";
import { GetStarted } from "./screens/GetStarted";
import { TrainingProgram } from "./screens/TrainingProgram";
function App() {
  return (
    <Router>
      <WorkoutProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/training-program" element={<TrainingProgram />} />
        </Routes>
      </WorkoutProvider>
    </Router>
  );
}

export default App;
