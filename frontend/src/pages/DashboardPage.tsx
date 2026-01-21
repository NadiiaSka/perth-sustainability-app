import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { householdApi, usageApi, DashboardData } from "../api/client";
import {
  ArrowLeft,
  ArrowUpDown,
  Award,
  Download,
  FileText,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import { getScoreColor } from "../utils/helpers";
import Button from "../components/Button";
import UsageChart from "../components/UsageChart";
import SummaryCard from "../components/SummaryCard";

function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<"type" | "value" | "date">(
    "date"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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

  const handleDelete = async (entryId: number) => {
    try {
      await usageApi.delete(entryId);
      loadDashboard();
    } catch (error) {
      console.error("Delete failed: ", error);
    }
  };

  const handleEdit = (entryId: number) => {
    navigate(`/household/${id}/edit/${entryId}`);
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

  const toggleSort = (column: "type" | "value" | "date") => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedEntries =
    data?.entries.slice().sort((a, b) => {
      let comparison = 0;

      if (sortColumn === "date") {
        const dateA = new Date(a.recorded_at).getTime();
        const dateB = new Date(b.recorded_at).getTime();
        comparison = dateA - dateB;
      } else if (sortColumn === "value") {
        comparison = Number(a.value) - Number(b.value);
      } else if (sortColumn === "type") {
        comparison = a.entry_type.localeCompare(b.entry_type);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    }) || [];

  const getSortedUsageData = (resources_type: string) =>
    data.entries
      .filter((entry) => entry.entry_type === resources_type)
      .map((entry) => ({
        value: Number(entry.value),
        date: entry.recorded_at,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div>
      <div>
        <div className="mb-4 md:mb-6">
          <Link
            to={`/`}
            className="flex items-center gap-2 text-base font-semibold text-gray-600 cursor-pointer md:text-lg hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            Back to Home page
          </Link>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <strong className="text-xl">{data.household.name}</strong>
              <Link
                to={`/household/${id}/edit-info`}
                className="p-2 mt-1 transition-colors border border-transparent rounded-full hover:bg-blue-50 hover:border-blue-200"
                title="Edit Household Info"
              >
                <Pencil className="w-4 h-4 text-blue-600 " />
              </Link>
            </div>

            <p className="text-gray-600">
              {data.household.members} member
              {data.household.members !== 1 && "s"}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 px-5 py-5 bg-white border border-gray-200 rounded-xl md:px-10">
            <div className="flex gap-3">
              <Award className="text-green-600" />
              <div className="text-gray-600">Green Score</div>
            </div>

            <div
              className={
                "text-4xl p-2 rounded-xl " + getScoreColor(data.greenScore)
              }
            >
              {data.greenScore}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 my-6 md:grid-cols-2">
          <SummaryCard
            title="Total Water Usage"
            value={data.summary.water || 0}
            unit="L"
            icon="💧"
            bgColor="bg-blue-100"
            textColor="text-blue-500"
          />
          <SummaryCard
            title="Total Energy"
            value={data.summary.energy || 0}
            unit="kWh"
            icon="⚡"
            bgColor="bg-yellow-100"
            textColor="text-yellow-500"
          />
        </div>
        <div className="grid grid-cols-1 gap-5 my-6 md:grid-cols-2">
          {data.entries.some((entry) => entry.entry_type === "water") ? (
            <UsageChart
              data={getSortedUsageData("water")}
              title="💧 Water Usage Trend"
              color="#3b82f6"
              label="Water (L)"
            />
          ) : null}
          {data.entries.some((entry) => entry.entry_type === "energy") ? (
            <UsageChart
              data={getSortedUsageData("energy")}
              title="⚡ Energy Usage Trend"
              color="#facc15"
              label="Energy (kWh)"
            />
          ) : null}
        </div>
      </div>
      {data.entries.length === 0 ? null : (
        <div className="p-5 my-6 bg-green-100 border border-green-300 rounded-lg">
          <h2 className="text-lg font-semibold">💡 Personalized Tips</h2>
          <p className="mt-1 text-gray-600">
            Recommendations based on your usage patterns
          </p>
          <ul className="mt-4 space-y-3">
            {data.tips.map((tip, index) => (
              <li key={index} className="flex items-center gap-3">
                <span className="px-2 py-0.5 text-white bg-green-500 rounded-full">
                  ✓
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="p-5 bg-white border rounded-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold ">Recent Entries</h2>
            <p className="text-gray-600">Your latest usage record</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {data.entries.length === 0 ? null : (
              <Button variant="secondary" onClick={handleExport}>
                <Download />
                <span>Export CSV</span>
              </Button>
            )}

            <Link
              to={`/household/${id}/add`}
              className="flex items-center justify-center gap-1 p-2 text-white bg-green-600 rounded-lg hover:bg-green-500"
            >
              <Plus />
              <div>Add Entry</div>
            </Link>
          </div>
        </div>

        {data.entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 mt-6 border-2 border-gray-200 border-dashed rounded-lg bg-gray-50">
            <div className="p-4 mb-4 bg-gray-200 rounded-full">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-700">
              No entries yet
            </h3>
            <p className="mb-6 text-sm text-center text-gray-500">
              Start tracking your water and energy usage to see insights
            </p>
            <Link
              to={`/household/${id}/add`}
              className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-500"
            >
              <Plus className="w-4 h-4" />
              Add Your First Entry
            </Link>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th
                    className="px-4 py-3 text-sm font-semibold text-left text-gray-700 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleSort("type")}
                  >
                    <div className="flex items-center gap-2">
                      Type
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-sm font-semibold text-left text-gray-700 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleSort("value")}
                  >
                    <div className="flex items-center gap-2">
                      Value
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-sm font-semibold text-left text-gray-700 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleSort("date")}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {sortedEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="transition-colors border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 font-medium">
                        {entry.entry_type === "water"
                          ? "💧 Water"
                          : "⚡ Energy"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {entry.value} {entry.entry_type === "water" ? "L" : "kWh"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(entry.recorded_at).toLocaleDateString()}{" "}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(entry.id)}
                          className="p-2 transition-colors border border-transparent rounded-full hover:bg-blue-50 hover:border-blue-100"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-2 transition-colors border border-transparent rounded-full hover:bg-red-50 hover:border-red-100"
                          title="Delete"
                        >
                          <Trash className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mt-4 cursor-pointer md:mt-6">
        <ArrowLeft className="w-5 h-5 text-gray-600 md:w-6 md:h-6" />
        <Link
          to={`/`}
          className="text-base font-semibold text-gray-600 md:text-lg hover:text-gray-800"
        >
          Back to Home page
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;
