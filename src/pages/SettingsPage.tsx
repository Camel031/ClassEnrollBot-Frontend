import {
  UserCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  CalendarIcon,
  ArrowRightOnRectangleIcon,
  KeyIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "../stores/authStore";
import Card, { CardHeader, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-midnight-100">Settings</h1>
        <p className="text-midnight-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
              <UserCircleIcon className="w-5 h-5 text-accent-400" />
            </div>
            <CardTitle>Profile</CardTitle>
          </div>
        </CardHeader>

        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-midnight-800/30">
            <EnvelopeIcon className="w-5 h-5 text-midnight-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-midnight-500 uppercase tracking-wider">Email</p>
              <p className="text-midnight-100 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Account Status */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-midnight-800/30">
            <ShieldCheckIcon className="w-5 h-5 text-midnight-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-midnight-500 uppercase tracking-wider">Account Status</p>
              <div className="flex items-center gap-2 mt-0.5">
                <div
                  className={`w-2 h-2 rounded-full ${
                    user?.is_active ? "bg-accent-400" : "bg-midnight-500"
                  }`}
                />
                <p className="text-midnight-100">
                  {user?.is_active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>

          {/* Member Since */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-midnight-800/30">
            <CalendarIcon className="w-5 h-5 text-midnight-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-midnight-500 uppercase tracking-wider">Member Since</p>
              <p className="text-midnight-100">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("zh-TW", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
              <KeyIcon className="w-5 h-5 text-accent-400" />
            </div>
            <CardTitle>Security</CardTitle>
          </div>
        </CardHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-midnight-800/30">
            <div>
              <p className="text-midnight-100 font-medium">Password</p>
              <p className="text-sm text-midnight-500">Last changed: Never</p>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-midnight-800/30">
            <div>
              <p className="text-midnight-100 font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-midnight-500">Not enabled</p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Coming Soon
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-rose-500/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-rose-400" />
            </div>
            <CardTitle className="text-rose-400">Danger Zone</CardTitle>
          </div>
        </CardHeader>

        <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
          <div className="flex items-start gap-4">
            <ArrowRightOnRectangleIcon className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-midnight-100">Sign Out</h3>
              <p className="text-sm text-midnight-400 mt-1 mb-4">
                You will be signed out of your account on this device. Your data
                will remain safe.
              </p>
              <Button
                variant="danger"
                onClick={logout}
                leftIcon={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
