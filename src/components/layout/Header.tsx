import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="bg-midnight-900/60 backdrop-blur-xl border-b border-midnight-700/50 sticky top-0 z-10">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Mobile menu button */}
        <button className="md:hidden p-2 rounded-lg hover:bg-midnight-800/50 transition-colors">
          <Bars3Icon className="w-6 h-6 text-midnight-300" />
        </button>

        {/* Mobile logo */}
        <h1 className="md:hidden text-lg font-bold text-white">
          Enroll<span className="text-accent-400">Bot</span>
        </h1>

        {/* Spacer for desktop */}
        <div className="hidden md:block" />

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl hover:bg-midnight-800/50 transition-all group">
            <BellIcon className="w-5 h-5 text-midnight-400 group-hover:text-midnight-200 transition-colors" />
            {/* Notification badge */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent-500 rounded-full ring-2 ring-midnight-900/60" />
          </button>

          {/* User menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-3 py-1.5 px-3 rounded-xl hover:bg-midnight-800/50 transition-all">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500/20 to-accent-600/20 border border-accent-500/30 flex items-center justify-center">
                <UserCircleIcon className="w-5 h-5 text-accent-400" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-midnight-100 truncate max-w-[140px]">
                  {user?.email?.split("@")[0]}
                </p>
                <p className="text-[10px] text-midnight-500 -mt-0.5">Active</p>
              </div>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95 translate-y-1"
              enterTo="transform opacity-100 scale-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100 translate-y-0"
              leaveTo="transform opacity-0 scale-95 translate-y-1"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 bg-midnight-900/95 backdrop-blur-xl rounded-xl shadow-elevated border border-midnight-700/50 py-1 focus:outline-none overflow-hidden">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-midnight-700/50">
                  <p className="text-sm font-medium text-midnight-100">
                    {user?.email}
                  </p>
                  <p className="text-xs text-midnight-500 mt-0.5">
                    {user?.is_verified ? "Verified account" : "Unverified account"}
                  </p>
                </div>

                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings"
                        className={`${
                          active ? "bg-midnight-800/50" : ""
                        } flex items-center gap-3 px-4 py-2.5 text-sm text-midnight-300 transition-colors`}
                      >
                        <Cog6ToothIcon className="w-4 h-4" />
                        Settings
                      </Link>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={`${
                          active ? "bg-rose-500/10 text-rose-400" : "text-midnight-300"
                        } flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm transition-colors`}
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}
