import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  UserCircleIcon,
  IdentificationIcon,
  ClockIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { PageSpinner } from "../components/ui/Spinner";
import Modal, { ConfirmDialog } from "../components/ui/Modal";
import { toast } from "../components/Toast";
import { ntnuAccountsApi } from "../api/ntnu-accounts";
import { NtnuAccount, NtnuAccountCreate } from "../types";
import { useWebSocket, OperationLog } from "../hooks/useWebSocket";

export default function NtnuAccountsPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<NtnuAccount | null>(null);
  const [loginAccount, setLoginAccount] = useState<NtnuAccount | null>(null);
  const queryClient = useQueryClient();

  // WebSocket for real-time logs
  const { logs, clearLogs } = useWebSocket({ devMode: true });

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["ntnu-accounts"],
    queryFn: ntnuAccountsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: ntnuAccountsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ntnu-accounts"] });
      toast.success("Account Removed", "NTNU account has been deleted.");
      setAccountToDelete(null);
    },
    onError: (error: Error) => {
      toast.error("Delete Failed", error.message);
    },
  });

  const loginMutation = useMutation({
    mutationFn: ntnuAccountsApi.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ntnu-accounts"] });
    },
    onError: () => {
      // Error handled in LoginProgressModal
    },
  });

  const handleTestLogin = useCallback((account: NtnuAccount) => {
    clearLogs();
    setLoginAccount(account);
    loginMutation.mutate(account.id);
  }, [clearLogs, loginMutation]);

  const handleDeleteConfirm = useCallback(() => {
    if (accountToDelete) {
      deleteMutation.mutate(accountToDelete.id);
    }
  }, [accountToDelete, deleteMutation]);

  if (isLoading) {
    return <PageSpinner label="Loading accounts..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-midnight-100">NTNU Accounts</h1>
          <p className="text-midnight-400 mt-1">
            {accounts?.length ?? 0} accounts configured
          </p>
        </div>
        <Button
          onClick={() => setIsAdding(true)}
          leftIcon={<PlusIcon className="w-5 h-5" />}
        >
          Add Account
        </Button>
      </div>

      {/* Account Grid */}
      {accounts && accounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {accounts.map((account, index) => (
            <Card
              key={account.id}
              hoverable
              glowOnHover
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-600/20 border border-accent-500/30 flex items-center justify-center">
                    <UserCircleIcon className="w-6 h-6 text-accent-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight-100 font-mono">
                      {account.student_id}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          account.is_active
                            ? "bg-accent-400"
                            : "bg-midnight-500"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          account.is_active
                            ? "text-accent-400"
                            : "text-midnight-500"
                        }`}
                      >
                        {account.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setAccountToDelete(account)}
                  className="p-2 rounded-lg text-midnight-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Info */}
              <div className="space-y-3 mb-4">
                {account.last_login_at && (
                  <div className="flex items-center gap-2 text-sm">
                    <ClockIcon className="w-4 h-4 text-midnight-500" />
                    <span className="text-midnight-400">Last login:</span>
                    <span className="text-midnight-300">
                      {new Date(account.last_login_at).toLocaleString("zh-TW")}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheckIcon className="w-4 h-4 text-midnight-500" />
                  <span className="text-midnight-400">Password encrypted</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-midnight-700/50">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleTestLogin(account)}
                  disabled={loginMutation.isPending}
                  leftIcon={<ArrowPathIcon className="w-4 h-4" />}
                >
                  Test Login
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-500/10 border border-accent-500/30 mb-4">
              <IdentificationIcon className="w-8 h-8 text-accent-400" />
            </div>
            <h3 className="text-lg font-semibold text-midnight-100 mb-2">
              No NTNU accounts
            </h3>
            <p className="text-midnight-400 mb-6 max-w-sm mx-auto">
              Add your NTNU account credentials to start tracking and
              auto-enrolling in courses.
            </p>
            <Button
              onClick={() => setIsAdding(true)}
              leftIcon={<PlusIcon className="w-5 h-5" />}
            >
              Add NTNU Account
            </Button>
          </div>
        </Card>
      )}

      {/* Add Account Modal */}
      {isAdding && <AddAccountModal onClose={() => setIsAdding(false)} />}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!accountToDelete}
        onClose={() => setAccountToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Account"
        message={`Are you sure you want to remove the NTNU account "${accountToDelete?.student_id}"? All associated course tracking will also be removed.`}
        confirmText="Remove"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />

      {/* Login Progress Modal */}
      <LoginProgressModal
        isOpen={!!loginAccount}
        onClose={() => setLoginAccount(null)}
        account={loginAccount}
        logs={logs}
        isPending={loginMutation.isPending}
        isSuccess={loginMutation.isSuccess}
        isError={loginMutation.isError}
        error={loginMutation.error}
      />
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
      toast.success("Account Added", "NTNU account has been added successfully.");
      onClose();
    },
    onError: (error: Error) => {
      toast.error("Failed to Add Account", error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const updateField = <K extends keyof NtnuAccountCreate>(
    field: K,
    value: NtnuAccountCreate[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Add NTNU Account"
      description="Enter your NTNU credentials to enable course tracking."
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Student ID"
          placeholder="e.g., 41271234H"
          leftIcon={<IdentificationIcon className="w-5 h-5" />}
          value={formData.student_id}
          onChange={(e) => updateField("student_id", e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Your NTNU password"
          leftIcon={<LockClosedIcon className="w-5 h-5" />}
          value={formData.password}
          onChange={(e) => updateField("password", e.target.value)}
          required
        />

        {/* Security Notice */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-midnight-800/30 border border-midnight-700/30">
          <ShieldCheckIcon className="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-midnight-200">
              Secure Storage
            </p>
            <p className="text-xs text-midnight-500 mt-0.5">
              Your password is encrypted with AES-256 before storage and never
              transmitted in plain text.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
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
    </Modal>
  );
}

// Status configuration for log entries
const STATUS_CONFIG: Record<string, { color: string; bgColor: string; label: string }> = {
  started: { color: "text-cyan-400", bgColor: "bg-cyan-500/20", label: "INIT" },
  in_progress: { color: "text-amber-400", bgColor: "bg-amber-500/20", label: "EXEC" },
  success: { color: "text-emerald-400", bgColor: "bg-emerald-500/20", label: "DONE" },
  failed: { color: "text-rose-400", bgColor: "bg-rose-500/20", label: "FAIL" },
  retry: { color: "text-violet-400", bgColor: "bg-violet-500/20", label: "RETRY" },
};

const OPERATION_ICONS: Record<string, string> = {
  login: "\u{1F511}",    // 🔑
  captcha: "\u{1F9E9}",  // 🧩
  browser: "\u{1F310}",  // 🌐
  session: "\u{1F504}",  // 🔄
};

interface LoginProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: NtnuAccount | null;
  logs: OperationLog[];
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
}

function LoginProgressModal({
  isOpen,
  onClose,
  account,
  logs,
  isPending,
  isSuccess,
  isError,
  error,
}: LoginProgressModalProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Filter logs for this account
  const relevantLogs = logs.filter(
    (log) =>
      log.account_id === account?.id ||
      log.operation_type === "login" ||
      log.operation_type === "captcha" ||
      log.operation_type === "browser"
  );

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [relevantLogs]);

  // Get current step from logs
  const currentStep = relevantLogs.length > 0 ? relevantLogs[relevantLogs.length - 1] : null;
  const stepMatch = currentStep?.message.match(/Step (\d+)\/(\d+)/);
  const currentStepNum = stepMatch ? parseInt(stepMatch[1]) : 0;
  const totalSteps = stepMatch ? parseInt(stepMatch[2]) : 6;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-500/20 border border-accent-500/30 flex items-center justify-center">
              <UserCircleIcon className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <h3 className="font-semibold text-midnight-100">
                Testing Login
              </h3>
              <p className="text-sm text-midnight-400 font-mono">
                {account?.student_id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-midnight-400 hover:text-midnight-200 hover:bg-midnight-800/50 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {isPending && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-midnight-400">
              <span>Progress</span>
              <span>{currentStepNum}/{totalSteps} steps</span>
            </div>
            <div className="h-2 bg-midnight-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-500 to-accent-400 transition-all duration-500 ease-out"
                style={{ width: `${(currentStepNum / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Status Banner */}
        {isSuccess && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="font-medium text-emerald-300">Login Successful!</p>
              <p className="text-sm text-emerald-400/70">Session established and ready for use.</p>
            </div>
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
            <ExclamationCircleIcon className="w-6 h-6 text-rose-400" />
            <div>
              <p className="font-medium text-rose-300">Login Failed</p>
              <p className="text-sm text-rose-400/70">{error?.message || "Unknown error"}</p>
            </div>
          </div>
        )}

        {/* Operation Logs */}
        <div className="relative bg-[#0a0a0f] rounded-xl border border-midnight-700/50 overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-2 bg-midnight-800/50 border-b border-midnight-700/50">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-midnight-500">NTNU://LOGIN_MONITOR</span>
          </div>

          {/* Logs */}
          <div className="max-h-64 overflow-y-auto p-2 space-y-1">
            {relevantLogs.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-midnight-500">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-midnight-600 border-t-accent-500 rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs font-mono">Waiting for operations...</p>
                </div>
              </div>
            ) : (
              relevantLogs.map((log, index) => {
                const statusConfig = STATUS_CONFIG[log.status] || STATUS_CONFIG.started;
                const icon = OPERATION_ICONS[log.operation_type] || "\u{1F4CB}";

                return (
                  <div
                    key={`${log.timestamp}-${index}`}
                    className="flex items-start gap-2 px-2 py-1.5 rounded hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-sm">{icon}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${statusConfig.color} ${statusConfig.bgColor}`}>
                      {statusConfig.label}
                    </span>
                    <span className="text-sm text-midnight-300 font-mono flex-1">
                      {log.message}
                    </span>
                    <span className="text-[10px] text-midnight-600 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={logsEndRef} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>
            {isPending ? "Hide" : "Close"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
