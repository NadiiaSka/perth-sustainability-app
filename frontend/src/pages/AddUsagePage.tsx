import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usageApi } from "../api/client";

function AddUsagePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    entry_type: "water" as "water" | "energy",
    value: "",
    recorded_at: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await usageApi.create({
        household_id: Number(id),
        entry_type: formData.entry_type,
        value: parseFloat(formData.value),
        recorded_at: formData.recorded_at || undefined,
      });
      navigate(`/household/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          Add Usage Entry
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="px-4 py-3 text-red-700 border border-red-200 rounded-lg bg-red-50">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="entry_type"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Entry Type
            </label>
            <select
              id="entry_type"
              value={formData.entry_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  entry_type: e.target.value as "water" | "energy",
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="water">💧 Water (Litres)</option>
              <option value="energy">⚡ Energy (kWh)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="value"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Value
            </label>
            <input
              type="number"
              id="value"
              step="0.01"
              required
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: e.target.value || "" })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={
                formData.entry_type === "water" ? "e.g., 150" : "e.g., 12.5"
              }
            />
          </div>

          <div>
            <label
              htmlFor="recorded_at"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Date & Time (Optional)
            </label>
            <input
              type="datetime-local"
              id="recorded_at"
              value={formData.recorded_at}
              onChange={(e) =>
                setFormData({ ...formData, recorded_at: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              Leave blank to use current date and time
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(`/household/${id}`)}
              className="flex-1 px-6 py-3 font-semibold text-gray-800 transition bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 font-semibold text-white transition rounded-lg bg-primary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUsagePage;
