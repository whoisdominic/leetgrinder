import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components";
import { Settings } from "./pages/Settings/Settings";
import { Dashboard, ActiveProblem, ProblemTypes } from "./pages";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router initialEntries={["/"]}>
        <div className="flex flex-col gap-4 items-center text-white p-4 h-full bg-gradient-to-br from-teal-900 to-zinc-800">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/problem" element={<ActiveProblem />} />
            <Route path="/types" element={<ProblemTypes />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}
