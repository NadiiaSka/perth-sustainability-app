import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usageApi } from "../api/client";
import { Droplet, Zap } from "lucide-react";

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
    <div>
      <div>
        <h1 className="text-2xl font-bold ">Add Usage Entry</h1>
        <p className="mb-6 text-gray-600">
          Enter the details of your water or energy usage below.
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-6 bg-white border rounded-lg shadow-md md:max-w-4xl"
        >
          {error && <div>{error}</div>}

          <div className="mb-4">
            <label htmlFor="entry_type" className="text-gray-800">
              Entry Type
            </label>
            <div className="flex justify-between gap-3 mt-2">
              <button
                onClick={(e) =>
                  setFormData({ ...formData, entry_type: "water" })
                }
                className={
                  formData.entry_type === "water"
                    ? "flex items-center justify-center w-full gap-3 p-2 border border-blue-400 rounded-lg bg-blue-50"
                    : "flex items-center justify-center w-full gap-3 p-2 border border-gray-300 rounded-lg bg-white"
                }
              >
                <Droplet className="text-blue-500" />
                <div>
                  <p
                    className={
                      "font-semibold " +
                      (formData.entry_type === "water"
                        ? "text-blue-600"
                        : "text-gray-800")
                    }
                  >
                    Water
                  </p>
                  <p className="text-gray-600">Litres</p>
                </div>
              </button>
              <button
                onClick={(e) =>
                  setFormData({ ...formData, entry_type: "energy" })
                }
                className={
                  formData.entry_type === "energy"
                    ? "flex items-center justify-center w-full gap-3 p-2 border border-yellow-400 rounded-lg bg-yellow-50"
                    : "flex items-center justify-center w-full gap-3 p-2 border border-gray-300 rounded-lg bg-white"
                }
              >
                <Zap
                  className={
                    formData.entry_type === "energy" ? "text-yellow-600" : ""
                  }
                />
                <div>
                  <p
                    className={
                      "font-semibold " +
                      (formData.entry_type === "energy"
                        ? "text-yellow-600"
                        : "text-gray-800")
                    }
                  >
                    Energy
                  </p>
                  <p className="text-gray-600">kWh</p>
                </div>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="value" className="block mb-1 text-gray-800">
              Value <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
                type="number"
                id="value"
                step="0.01"
                required
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value || "" })
                }
                placeholder={
                  formData.entry_type === "water" ? "e.g., 150" : "e.g., 12.5"
                }
              />
              <span className="absolute font-medium text-gray-600 -translate-y-1/2 right-3 top-1/2">
                {formData.entry_type === "water" ? "L" : "kWh"}
              </span>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-800" htmlFor="recorded_at">
              Date & Time <span className="text-gray-600">(Optional)</span>
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
              type="datetime-local"
              id="recorded_at"
              value={formData.recorded_at}
              onChange={(e) =>
                setFormData({ ...formData, recorded_at: e.target.value })
              }
            />
            <p className="mt-1 text-sm text-gray-600">
              Leave blank to use current date and time
            </p>
          </div>

          <div className="flex justify-end gap-4 pt-5 mt-6 border-t">
            <button
              type="button"
              onClick={() => navigate(`/household/${id}`)}
              className="font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-blue-500 rounded-lg"
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
