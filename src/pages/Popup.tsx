import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { customTheme, Header } from "../components";
import { Settings } from "./Settings";
import { Dashboard } from "./Dashboard";
import { ActiveProblem } from "./ActiveProblem";

export default function Popup() {
  return (
    <Router initialEntries={["/"]}>
      <div className="flex flex-col gap-4 items-center text-white p-4 h-full bg-gradient-to-br from-teal-900 to-zinc-800">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/problem" element={<ActiveProblem />} />
        </Routes>
      </div>
    </Router>
  );
}
