import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { householdApi } from "../api/client";
import { ArrowLeft } from "lucide-react";
import FormInput from "../components/FormInput";
import Button from "../components/Button";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{
    name: string;
    members: number | "";
    postcode: string;
  }>({
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
      const response = await householdApi.create({
        ...formData,
        members: formData.members || 1,
      });
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
        <div className="mb-4 md:mb-6">
          <Link
            to={`/`}
            className="flex items-center gap-2 text-base font-semibold text-gray-600 md:text-lg hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            Back to Home page
          </Link>
        </div>
        <h1 className="mb-6 text-2xl font-bold">Register Your Household</h1>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-sm md:max-w-4xl"
        >
          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="mb-4">
            {FormInput({
              label: "Household Name",
              type: "text",
              value: formData.name,
              onChange: (value: string) =>
                setFormData({ ...formData, name: value }),
              placeholder: "e.g., Smith Family",
              required: true,
            })}
          </div>

          <div className="mb-4">
            {FormInput({
              label: "Number of Occupants",
              type: "number",
              value: formData.members,
              onChange: (value: string) =>
                setFormData({ ...formData, members: Number(value) }),
              placeholder: "e.g., 4",
              required: true,
              min: "1",
            })}
          </div>

          <div className="mb-6">
            {FormInput({
              label: "Postcode",
              type: "number",
              value: formData.postcode,
              onChange: (value: string) =>
                setFormData({ ...formData, postcode: value }),
              placeholder: "e.g., 6000",
              required: true,
            })}
          </div>

          <div className="flex justify-center">
            <Button
              variant="primary"
              size="md"
              loading={loading}
              fullWidth={false}
            >
              {loading ? "Registering..." : "Register Household"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
