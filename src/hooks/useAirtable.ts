import { useEffect } from "react";
import { useAppStore } from "../state/store";
import { airtableService } from "../services/AirtableService";

export function useAirtable() {
  const { airtableApiKey, airtableBaseName } = useAppStore();

  useEffect(() => {
    if (airtableApiKey && airtableBaseName) {
      airtableService.updateCredentials(airtableApiKey, airtableBaseName);
    }
  }, [airtableApiKey, airtableBaseName]);

  return airtableService;
}
