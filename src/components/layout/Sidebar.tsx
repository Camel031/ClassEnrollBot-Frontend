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
    <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-20">
      <div className="flex flex-col flex-grow bg-midnight-900/80 backdrop-blur-xl border-r border-midnight-700/50">
        {/* Logo Section */}
        <div className="flex items-center h-16 px-6 border-b border-midnight-700/50">
          <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-glow-sm">
              <AcademicCapIcon className="w-5 h-5 text-white" />
            </div>
            {/* Logo Text */}
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Enroll<span className="text-accent-400">Bot</span>
              </h1>
              <p className="text-[10px] text-midnight-400 -mt-0.5 tracking-wider uppercase">
                Course Helper
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
          {navigation.map((item, index) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-accent-500/10 text-accent-400 border border-accent-500/30 shadow-glow-sm"
                    : "text-midnight-300 hover:bg-midnight-800/50 hover:text-midnight-100 border border-transparent"
                }`
              }
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1.5 rounded-lg mr-3 transition-colors ${
                      isActive
                        ? "bg-accent-500/20"
                        : "bg-midnight-800/50 group-hover:bg-midnight-700/50"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? "text-accent-400" : "text-midnight-400 group-hover:text-midnight-200"
                      }`}
                    />
                  </div>
                  {item.name}

                  {/* Active indicator */}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-400 shadow-glow-sm" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="px-4 py-4 border-t border-midnight-700/50">
          <div className="px-3 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/30">
            <p className="text-xs font-medium text-midnight-300">NTNU Course Enrollment</p>
            <p className="text-[10px] text-midnight-500 mt-0.5">
              Automated registration assistant
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
