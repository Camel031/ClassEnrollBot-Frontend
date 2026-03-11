import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-midnight-950">
      {/* Background gradient mesh */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(at 40% 20%, rgba(20, 184, 166, 0.08) 0px, transparent 50%),
            radial-gradient(at 80% 0%, rgba(45, 212, 191, 0.05) 0px, transparent 50%),
            radial-gradient(at 0% 50%, rgba(99, 102, 241, 0.05) 0px, transparent 50%)
          `,
        }}
      />

      {/* Sidebar - hidden on mobile */}
      <Sidebar />

      {/* Main content area */}
      <div className="md:pl-72 relative z-10">
        <Header />
        <main className="p-4 md:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
