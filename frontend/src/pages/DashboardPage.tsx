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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-8">Household not found</div>;
  }

  const chartData = [
    { name: "Water", value: data.summary.water || 0 },
    { name: "Energy", value: data.summary.energy || 0 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {data.household.name}
            </h1>
            <p className="text-gray-600">📍 {data.household.postcode}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-2">Green Score</div>
            <div
              className={`text-5xl font-bold ${getScoreColor(data.greenScore)}`}
            >
              {data.greenScore}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              💧 Total Water
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {data.summary.water?.toFixed(1) || 0} L
            </p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              ⚡ Total Energy
            </h3>
            <p className="text-3xl font-bold text-yellow-600">
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

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          💡 Personalized Tips
        </h2>
        <ul className="space-y-3">
          {data.tips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span className="text-gray-700">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Entries</h2>
          <div className="space-x-4">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Export CSV
            </button>
            <Link
              to={`/household/${id}/add`}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
            >
              Add Entry
            </Link>
          </div>
        </div>

        {data.entries.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No entries yet. Start tracking!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Value
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          entry.entry_type === "water"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {entry.entry_type === "water"
                          ? "💧 Water"
                          : "⚡ Energy"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {entry.value} {entry.entry_type === "water" ? "L" : "kWh"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
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
