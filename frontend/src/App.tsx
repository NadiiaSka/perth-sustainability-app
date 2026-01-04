import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AddUsagePage from "./pages/AddUsagePage";

function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <div>
        <nav>
          <div>
            <div>
              <Link to="/">🌱 Sustainability Tracker</Link>
              <Link to="/register">Register Household</Link>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/household/:id" element={<DashboardPage />} />
            <Route path="/household/:id/add" element={<AddUsagePage />} />
          </Routes>
        </main>

        <footer>
          <div>
            <p>
              © 2025 Sustainability Tracker - Track your environmental impact
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
