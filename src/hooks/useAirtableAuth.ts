import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../state/store";

export function useAirtableAuth() {
  const navigate = useNavigate();
  const { airtableApiKey, airtableBaseName } = useAppStore();

  useEffect(() => {
    if (!airtableApiKey || !airtableBaseName) {
      navigate("/settings");
    }
  }, [airtableApiKey, airtableBaseName, navigate]);

  return {
    hasCredentials: !!airtableApiKey && !!airtableBaseName,
  };
}
