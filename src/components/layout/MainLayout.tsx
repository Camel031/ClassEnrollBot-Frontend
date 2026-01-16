import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar />

      {/* Main content area */}
      <div className="md:pl-64">
        <Header />
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
