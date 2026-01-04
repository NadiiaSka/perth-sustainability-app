import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { householdApi, usageApi, DashboardData } from "../api/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [id]);

  const loadDashboard = async () => {
    try {
      const response = await householdApi.getById(Number(id));
      setData(response.data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await usageApi.exportCsv(Number(id));
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `usage_${id}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  if (loading) {
    return (
      <div>
        <div>Loading...</div>
      </div>
    );
  }

  if (!data) {
    return <div>Household not found</div>;
  }

  const chartData = [
    { name: "Water", value: data.summary.water || 0 },
    { name: "Energy", value: data.summary.energy || 0 },
  ];

  return (
    <div>
      <div>
        <div>
          <div>
            <h1>
              {data.household.name}
            </h1>
            <p>📍 {data.household.postcode}</p>
          </div>
          <div>
            <div>Green Score</div>
            <div>
              {data.greenScore}
            </div>
          </div>
        </div>

        <div>
          <div>
            <h3>
              💧 Total Water
            </h3>
            <p>
              {data.summary.water?.toFixed(1) || 0} L
            </p>
          </div>
          <div>
            <h3>
              ⚡ Total Energy
            </h3>
            <p>
              {data.summary.energy?.toFixed(1) || 0} kWh
            </p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2>
          💡 Personalized Tips
        </h2>
        <ul>
          {data.tips.map((tip, index) => (
            <li key={index}>
              <span>✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div>
          <h2>Recent Entries</h2>
          <div>
            <button onClick={handleExport}>
              Export CSV
            </button>
            <Link to={`/household/${id}/add`}>
              Add Entry
            </Link>
          </div>
        </div>

        {data.entries.length === 0 ? (
          <p>
            No entries yet. Start tracking!
          </p>
        ) : (
          <div>
            <table>
              <thead>
                <tr>
                  <th>
                    Type
                  </th>
                  <th>
                    Value
                  </th>
                  <th>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>
                      <span>
                        {entry.entry_type === "water"
                          ? "💧 Water"
                          : "⚡ Energy"}
                      </span>
                    </td>
                    <td>
                      {entry.value} {entry.entry_type === "water" ? "L" : "kWh"}
                    </td>
                    <td>
                      {new Date(entry.recorded_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
