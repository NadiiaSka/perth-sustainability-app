import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { householdApi } from "../api/client";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    members: 1,
    postcode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await householdApi.create(formData);
      navigate(`/household/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to register household");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          Register Your Household
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="px-4 py-3 text-red-700 border border-red-200 rounded-lg bg-red-50">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Household Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Smith Family"
            />
          </div>
          <div>
            <label
              htmlFor="members"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Number of occupants
            </label>
            <input
              type="number"
              id="members"
              required
              value={formData.members}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  members: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., 4"
            />
          </div>

          <div>
            <label
              htmlFor="postcode"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Postcode
            </label>
            <input
              type="text"
              id="postcode"
              required
              value={formData.postcode}
              onChange={(e) =>
                setFormData({ ...formData, postcode: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., 6000"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 font-semibold text-white transition rounded-lg bg-primary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register Household"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
