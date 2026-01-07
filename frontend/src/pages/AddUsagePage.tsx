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
    <div>
      <div>
        <h1>Add Usage Entry</h1>

        <form onSubmit={handleSubmit}>
          {error && <div>{error}</div>}

          <div>
            <label htmlFor="entry_type">Entry Type</label>
            <select
              id="entry_type"
              value={formData.entry_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  entry_type: e.target.value as "water" | "energy",
                })
              }
            >
              <option value="water">💧 Water (Litres)</option>
              <option value="energy">⚡ Energy (kWh)</option>
            </select>
          </div>

          <div>
            <label htmlFor="value">Value</label>
            <input
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
          </div>

          <div>
            <label htmlFor="recorded_at">Date & Time (Optional)</label>
            <input
              type="datetime-local"
              id="recorded_at"
              value={formData.recorded_at}
              onChange={(e) =>
                setFormData({ ...formData, recorded_at: e.target.value })
              }
            />
            <p>Leave blank to use current date and time</p>
          </div>

          <div>
            <button type="button" onClick={() => navigate(`/household/${id}`)}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUsagePage;
