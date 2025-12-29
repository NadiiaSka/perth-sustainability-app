import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { householdApi, Household } from "../api/client";

function HomePage() {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHouseholds();
  }, []);

  const loadHouseholds = async () => {
    try {
      const response = await householdApi.getAll();
      setHouseholds(response.data.households);
    } catch (error) {
      console.error("Failed to load households:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Sustainability Tracker
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Monitor your household's water and energy usage, get personalized
          tips, and track your environmental impact with our Green Score system.
        </p>
        <Link
          to="/register"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition text-lg font-semibold"
        >
          Get Started
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Registered Households
        </h2>

        {households.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No households registered yet. Be the first to start tracking!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {households.map((household) => (
              <Link
                key={household.id}
                to={`/household/${household.id}`}
                className="block p-6 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-primary transition"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {household.name}
                </h3>
                <p className="text-gray-600">📍 {household.postcode}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Registered:{" "}
                  {new Date(household.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
