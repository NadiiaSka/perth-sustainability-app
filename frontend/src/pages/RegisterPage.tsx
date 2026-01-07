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
    <div>
      <div>
        <h1>
          Register Your Household
        </h1>

        <form onSubmit={handleSubmit}>
          {error && (
            <div>
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name">
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
              placeholder="e.g., Smith Family"
            />
          </div>
          <div>
            <label htmlFor="members">
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
              placeholder="e.g., 4"
            />
          </div>

          <div>
            <label htmlFor="postcode">
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
              placeholder="e.g., 6000"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Household"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
