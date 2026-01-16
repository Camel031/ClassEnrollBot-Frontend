import { useAuthStore } from "../stores/authStore";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function SettingsPage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Profile Section */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <p className="text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Account Status
            </label>
            <p className="text-gray-900">
              {user?.is_active ? "Active" : "Inactive"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Member Since
            </label>
            <p className="text-gray-900">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("zh-TW")
                : "-"}
            </p>
          </div>
        </div>
      </Card>

      {/* Security Section */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
        <div className="space-y-4">
          <Button variant="secondary">Change Password</Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card>
        <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-medium text-red-900 mb-2">Logout</h3>
            <p className="text-sm text-red-700 mb-3">
              You will be signed out of your account.
            </p>
            <Button variant="danger" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
