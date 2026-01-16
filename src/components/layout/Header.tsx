import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "../../stores/authStore";

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Mobile menu button */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
          <Bars3Icon className="w-6 h-6 text-gray-600" />
        </button>

        {/* Mobile logo */}
        <h1 className="md:hidden text-xl font-bold text-primary-600">
          EnrollBot
        </h1>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <BellIcon className="w-6 h-6 text-gray-600" />
            {/* Notification badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
              <UserCircleIcon className="w-6 h-6 text-gray-600" />
              <span className="hidden sm:block text-sm text-gray-700">
                {user?.email}
              </span>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                    >
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}
