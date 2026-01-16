import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Spinner from "../components/ui/Spinner";
import { ntnuAccountsApi } from "../api/ntnu-accounts";
import { NtnuAccount, NtnuAccountCreate } from "../types";

export default function NtnuAccountsPage() {
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["ntnu-accounts"],
    queryFn: ntnuAccountsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: ntnuAccountsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ntnu-accounts"] });
    },
  });

  const loginMutation = useMutation({
    mutationFn: ntnuAccountsApi.login,
    onSuccess: (data) => {
      alert(data.message);
      queryClient.invalidateQueries({ queryKey: ["ntnu-accounts"] });
    },
    onError: (error: Error) => {
      alert(`Login failed: ${error.message}`);
    },
  });

  const handleDelete = (account: NtnuAccount) => {
    if (confirm(`Delete NTNU account "${account.student_id}"?`)) {
      deleteMutation.mutate(account.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">NTNU Accounts</h1>
        <Button onClick={() => setIsAdding(true)}>
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Account
        </Button>
      </div>

      {accounts && accounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <Card key={account.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <UserCircleIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {account.student_id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {account.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(account)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>

              {account.last_login_at && (
                <p className="text-sm text-gray-600 mb-4">
                  Last login:{" "}
                  {new Date(account.last_login_at).toLocaleString("zh-TW")}
                </p>
              )}

              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => loginMutation.mutate(account.id)}
                isLoading={loginMutation.isPending}
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Login to NTNU
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <UserCircleIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No NTNU accounts
            </h3>
            <p className="text-gray-600 mb-4">
              Add your NTNU account to start tracking courses.
            </p>
            <Button onClick={() => setIsAdding(true)}>
              <PlusIcon className="w-5 h-5 mr-2" />
              Add NTNU Account
            </Button>
          </div>
        </Card>
      )}

      {isAdding && <AddAccountModal onClose={() => setIsAdding(false)} />}
    </div>
  );
}

function AddAccountModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<NtnuAccountCreate>({
    student_id: "",
    password: "",
  });

  const createMutation = useMutation({
    mutationFn: ntnuAccountsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ntnu-accounts"] });
      onClose();
    },
    onError: (error: Error) => {
      alert(`Failed to add account: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold mb-4">Add NTNU Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Student ID"
            value={formData.student_id}
            onChange={(e) =>
              setFormData({ ...formData, student_id: e.target.value })
            }
            placeholder="e.g., 41271234H"
            required
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <p className="text-sm text-gray-500">
            Your password is encrypted and stored securely.
          </p>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={createMutation.isPending}
            >
              Add Account
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
