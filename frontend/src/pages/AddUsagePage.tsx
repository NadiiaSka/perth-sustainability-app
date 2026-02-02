import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { usageApi } from "../api/client";
import { ArrowLeft, Calendar, Droplet, Zap } from "lucide-react";
import FormInput from "../components/FormInput";
import Button from "../components/Button";

function AddUsagePage() {
  const { id, entryId } = useParams();
  const isEditMode = !!entryId;

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    entry_type: "water" as "water" | "energy",
    value: "",
    recorded_at: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && entryId) {
      setLoading(true);
      const loadEntry = async () => {
        try {
          const response = await usageApi.getById(Number(entryId));
          // Convert ISO date to datetime-local format (yyyy-MM-ddThh:mm)
          const dateValue = response.data.recorded_at
            ? new Date(response.data.recorded_at).toISOString().slice(0, 16)
            : "";
          setFormData({
            entry_type: response.data.entry_type,
            value: String(response.data.value),
            recorded_at: dateValue,
          });
        } catch (err: any) {
          setError(err.response?.data?.error || "Failed to load entry");
        } finally {
          setLoading(false);
        }
      };
      loadEntry();
    }
  }, [entryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate that the selected date-time is not in the future
    if (formData.recorded_at) {
      const selectedDate = new Date(formData.recorded_at);
      const now = new Date();
      if (selectedDate > now) {
        setError("Cannot select a future date and time");
        return;
      }
    }

    setLoading(true);

    try {
      if (isEditMode && entryId) {
        await usageApi.update(Number(entryId), {
          entry_type: formData.entry_type,
          value: parseFloat(formData.value),
          recorded_at: formData.recorded_at || undefined,
        });
      } else {
        await usageApi.create({
          household_id: Number(id),
          entry_type: formData.entry_type,
          value: parseFloat(formData.value),
          recorded_at: formData.recorded_at || undefined,
        });
      }
      navigate(`/household/${id}`);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          `Failed to ${isEditMode ? "update" : "add"} entry`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 md:px-0">
      <div className="mb-4 md:mb-6">
        <Link
          to={`/household/${id}`}
          className="flex items-center gap-2 text-base font-semibold text-gray-600 md:text-lg hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          Back to Household
        </Link>
      </div>

      <div>
        <h1 className="text-xl font-bold md:text-2xl">
          {isEditMode ? "Edit Usage Entry" : "Add Usage Entry"}
        </h1>
        <p className="mb-4 text-sm text-gray-600 md:mb-6 md:text-base">
          {isEditMode
            ? "Edit the details of your water or energy usage below."
            : "Enter the details of your water or energy usage below."}
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full p-4 bg-white border rounded-lg shadow-md md:p-6 md:max-w-2xl lg:max-w-4xl"
        >
          {error && <div>{error}</div>}

          <div className="mb-4">
            <label htmlFor="entry_type" className="text-gray-800">
              Entry Type
            </label>
            <div className="grid grid-cols-1 gap-3 mt-2 md:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, entry_type: "water" })
                }
                className={
                  formData.entry_type === "water"
                    ? "flex items-center justify-center w-full gap-3 p-2 border border-blue-400 rounded-lg bg-blue-50 shadow-md"
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
                type="button"
                onClick={() =>
                  setFormData({ ...formData, entry_type: "energy" })
                }
                className={
                  formData.entry_type === "energy"
                    ? "flex items-center justify-center w-full gap-3 p-2 border border-yellow-400 rounded-lg bg-yellow-50 shadow-md"
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
            <FormInput
              label="Value"
              type="number"
              value={formData.value}
              onChange={(value: string) =>
                setFormData({ ...formData, value: value })
              }
              placeholder={
                formData.entry_type === "water" ? "e.g., 150" : "e.g., 125"
              }
              required
              step="0.1"
              suffix={formData.entry_type === "water" ? "L" : "kWh"}
            />
          </div>

          <div className="mb-4">
            <FormInput
              label="Date & Time (optional)"
              type="datetime-local"
              value={formData.recorded_at}
              onChange={(value: string) =>
                setFormData({ ...formData, recorded_at: value })
              }
              placeholder="Select date and time"
              max={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16)}
              icon={<Calendar className="w-5 h-5 text-gray-400" />}
              helperText="Leave blank to use current date and time"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-4 mt-6 border-t sm:flex-row sm:justify-end sm:gap-4">
            {Button({
              variant: "secondary",
              onClick: () => navigate(`/household/${id}`),
              children: "Cancel",
              fullWidth: false,
            })}
            {Button({
              variant: "primary",
              loading: loading,
              children: isEditMode ? "Edit Entry" : "Add Entry",
              fullWidth: false,
              disabled: false,
              size: "md",
            })}
          </div>
        </form>
      </div>
      <div className="grid max-w-full grid-cols-1 gap-4 mt-6 mb-8 md:grid-cols-2 lg:gap-6 md:max-w-2xl lg:max-w-4xl">
        <div className="flex flex-col p-4 border border-blue-200 rounded-xl bg-blue-50 md:p-5">
          <div className="flex items-start gap-3 md:gap-4">
            <Droplet className="w-6 h-6 mt-1 text-blue-500 md:w-8 md:h-8" />
            <div>
              <h3 className="text-base font-semibold text-blue-900 md:text-lg">
                Water Usage
              </h3>
              <p className="text-xs text-blue-600 md:text-sm">
                Track consumption in litres. Average household uses 150-250L per
                person daily.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col p-4 border border-yellow-200 rounded-xl bg-yellow-50 md:p-5">
          <div className="flex items-start gap-3 md:gap-4">
            <Zap className="w-6 h-6 mt-1 text-yellow-600 md:w-8 md:h-8" />
            <div>
              <h3 className="text-base font-semibold text-yellow-900 md:text-lg">
                Energy Usage
              </h3>
              <p className="text-xs text-yellow-700 md:text-sm">
                Track consumption in kWh. Average household uses 8-10 kWh daily.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUsagePage;
