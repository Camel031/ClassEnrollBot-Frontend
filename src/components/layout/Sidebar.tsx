import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  AcademicCapIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Courses", href: "/courses", icon: AcademicCapIcon },
  { name: "NTNU Accounts", href: "/ntnu-accounts", icon: UserCircleIcon },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary-600">EnrollBot</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
