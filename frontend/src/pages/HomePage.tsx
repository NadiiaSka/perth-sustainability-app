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
      <div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="flex flex-col items-center">
        <p className="text-center">
          Monitor your household's water and energy usage, get personalized
          tips, and track your environmental impact with our Green Score system.
        </p>
        <div className="px-3 py-2 mt-8 font-semibold text-white bg-green-600 rounded-md">
          <Link to="/register">Register Household</Link>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-semibold">Registered Households:</h2>

        {households.length === 0 ? (
          <p>No households registered yet. Be the first to start tracking!</p>
        ) : (
          <div>
            {households.map((household) => (
              <Link key={household.id} to={`/household/${household.id}`}>
                <h3>{household.name}</h3>
                <p>📍 {household.postcode}</p>
                <p>
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
