import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { householdApi, Household } from "../api/client";
import { Leaf, Zap, Droplet } from "lucide-react";
import { getScoreColor } from "../utils/helpers";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function HomePage() {
  const [householdsWithData, setHouseholdsWithData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    loadHouseholds();
  }, []);

  const loadHouseholds = async () => {
    setLoading(true);
    setLoadError(null);

    try {
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const response = await householdApi.getAll();
          const households = response.data.households;

          if (households.length === 0 && attempt < MAX_RETRIES) {
            await sleep(RETRY_DELAY_MS * attempt);
            continue;
          }

          const householdsData = await Promise.all(
            households.map(async (household: Household) => {
              try {
                const data = await householdApi.getById(household.id);
                return { ...household, ...data.data };
              } catch {
                return household;
              }
            }),
          );

          setHouseholdsWithData(householdsData);
          return;
        } catch (error: any) {
          const status = error?.response?.status;
          const isRetriable =
            !status ||
            status >= 500 ||
            status === 429 ||
            error?.code === "ECONNABORTED";

          if (!isRetriable || attempt === MAX_RETRIES) {
            console.error("Failed to load households:", error);
            setHouseholdsWithData([]);
            setLoadError("Could not connect to backend. Please try again.");
            return;
          }

          await sleep(RETRY_DELAY_MS * attempt);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div>Loading households...</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div>
        <p className="text-red-600">{loadError}</p>
        <button
          type="button"
          onClick={loadHouseholds}
          className="px-3 py-2 mt-3 text-white bg-green-600 rounded-md hover:bg-green-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-col items-center">
        <p className="text-center">
          Monitor your household's water and energy usage, get personalized
          tips, and track your environmental impact with our Green Score system.
        </p>
        <Link
          to="/register"
          className="inline-block px-3 py-2 mt-8 font-semibold text-white transition-all duration-200 bg-green-600 rounded-md hover:bg-green-500 active:scale-95"
        >
          Register Household
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="font-semibold">Registered Households:</h2>

        {householdsWithData.length === 0 ? (
          <p>No households registered yet. Be the first to start tracking!</p>
        ) : (
          <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
            {householdsWithData.map((household) => (
              <Link
                key={household.id}
                to={`/household/${household.id}`}
                className="block p-4 mt-4 transition duration-300 ease-in-out bg-white border border-gray-400 rounded-xl hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col">
                    <strong>{household.name}</strong>
                    <span className="text-gray-600">
                      {household.members} member{household.members !== 1 && "s"}
                    </span>
                  </div>
                  <div
                    className={`flex gap-1 px-3 py-2 ${getScoreColor(
                      household.greenScore,
                    )} rounded-xl`}
                  >
                    <Leaf />
                    <p className="font-semibold">{household.greenScore}</p>
                  </div>
                </div>
                <div className="text-gray-600">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1 mb-2">
                      <Droplet className="w-5 h-5 text-blue-600" />
                      <span>Water usage: </span>
                    </div>
                    <p>
                      {household.summary.water
                        ? `${household.summary.water} L/day`
                        : "No data"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <span>Energy usage:</span>
                    </div>
                    <p>
                      {household.summary.energy
                        ? `${household.summary.energy} kWh/day`
                        : "No data"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
