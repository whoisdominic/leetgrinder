import { useState } from "react";
import { Flags } from "../../constants";
import { SupaLoginForm } from "./SupaLoginForm";
import { useAppStore } from "../../state/store";
import { useAirtable } from "../../hooks/useAirtable";

export function Settings() {
  const {
    airtableApiKey,
    airtableBaseName,
    setAirtableApiKey,
    setAirtableBaseName,
  } = useAppStore();

  const [tempApiKey, setTempApiKey] = useState(airtableApiKey);
  const [tempBaseName, setTempBaseName] = useState(airtableBaseName);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const airtableService = useAirtable();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveSuccess(false);

    try {
      // Save the credentials to the store
      setAirtableApiKey(tempApiKey);
      setAirtableBaseName(tempBaseName);

      // Small delay to simulate API call and show loader
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSaveSuccess(true);
    } catch (error) {
      console.error("Error saving Airtable credentials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center text-white rounded-lg h-full w-full p-4">
      <h2 className="text-xl font-semibold">Settings</h2>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div className="space-y-2">
          <label htmlFor="airtableApiKey" className="block text-sm font-medium">
            Airtable API Key
          </label>
          <input
            type="password"
            id="airtableApiKey"
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your Airtable API key"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="airtableBaseName"
            className="block text-sm font-medium"
          >
            Airtable Base Name
          </label>
          <input
            type="text"
            id="airtableBaseName"
            value={tempBaseName}
            onChange={(e) => setTempBaseName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your Airtable base name"
          />
        </div>

        {(!airtableApiKey || !airtableBaseName) && (
          <div className="text-yellow-500 text-sm">
            Airtable integration is not configured. Please enter your API key
            and base name to enable Airtable features.
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </div>
          ) : (
            "Save Airtable Credentials"
          )}
        </button>

        {saveSuccess && (
          <div className="text-green-500 text-sm text-center mt-2">
            Airtable credentials saved successfully!
          </div>
        )}
      </form>

      {Flags.auth_enabled && <SupaLoginForm />}
    </div>
  );
}

export default Settings;
