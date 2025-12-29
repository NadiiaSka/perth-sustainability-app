import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { householdApi } from "../api/client";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
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
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Register Your Household
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
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
              htmlFor="postcode"
              className="block text-sm font-medium text-gray-700 mb-2"
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
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register Household"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
