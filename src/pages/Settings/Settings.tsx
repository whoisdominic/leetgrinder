import { Flags } from "../../constants";
import { SupaLoginForm } from "./SupaLoginForm";

export function Settings() {
  return (
    <div className="flex flex-col gap-2 items-center text-white rounded-lg h-full w-full">
      <h2 className="text-xl font-semibold">Settings</h2>
      {Flags.auth_enabled && <SupaLoginForm />}
    </div>
  );
}

export default Settings;
