import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AddUsagePage from "./pages/AddUsagePage";

function App() {
  return (
    <BrowserRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-primary text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-bold">
                🌱 Sustainability Tracker
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-white text-primary rounded-lg hover:bg-gray-100 transition"
              >
                Register Household
              </Link>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/household/:id" element={<DashboardPage />} />
            <Route path="/household/:id/add" element={<AddUsagePage />} />
          </Routes>
        </main>

        <footer className="bg-gray-800 text-white mt-16 py-8">
          <div className="container mx-auto px-4 text-center">
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
