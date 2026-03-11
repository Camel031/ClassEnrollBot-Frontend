import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PlusIcon,
  TrashIcon,
  AcademicCapIcon,
  UserIcon,
  HashtagIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { PageSpinner } from "../components/ui/Spinner";
import Input from "../components/ui/Input";
import Modal, { ConfirmDialog } from "../components/ui/Modal";
import { toast } from "../components/Toast";
import { coursesApi } from "../api/courses";
import { ntnuAccountsApi } from "../api/ntnu-accounts";
import { TrackedCourse, TrackedCourseCreate } from "../types";

export default function CoursesPage() {
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<TrackedCourse | null>(null);
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: coursesApi.getAll,
  });

  const { data: accounts } = useQuery({
    queryKey: ["ntnu-accounts"],
    queryFn: ntnuAccountsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: coursesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course Removed", "Course tracking has been stopped.");
      setCourseToDelete(null);
    },
    onError: (error: Error) => {
      toast.error("Delete Failed", error.message);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_enabled }: { id: string; is_enabled: boolean }) =>
      coursesApi.update(id, { is_enabled }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success(
        variables.is_enabled ? "Monitoring Started" : "Monitoring Paused",
        variables.is_enabled
          ? "Course is now being monitored."
          : "Course monitoring has been paused."
      );
    },
    onError: (error: Error) => {
      toast.error("Update Failed", error.message);
    },
  });

  const handleDeleteConfirm = useCallback(() => {
    if (courseToDelete) {
      deleteMutation.mutate(courseToDelete.id);
    }
  }, [courseToDelete, deleteMutation]);

  if (isLoading) {
    return <PageSpinner label="Loading courses..." />;
  }

  const hasAvailableSlots = (course: TrackedCourse) =>
    course.current_enrolled < course.max_capacity;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-midnight-100">Tracked Courses</h1>
          <p className="text-midnight-400 mt-1">
            {courses?.length ?? 0} courses being monitored
          </p>
        </div>
        <Button
          onClick={() => setIsAddingCourse(true)}
          leftIcon={<PlusIcon className="w-5 h-5" />}
        >
          Add Course
        </Button>
      </div>

      {/* Course Grid */}
      {courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {courses.map((course, index) => (
            <Card
              key={course.id}
              hoverable
              glowOnHover
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-midnight-100 truncate">
                    {course.course_name}
                  </h3>
                  <p className="text-sm text-midnight-400 font-mono">
                    {course.course_code}
                  </p>
                </div>
                <button
                  onClick={() => setCourseToDelete(course)}
                  className="p-2 rounded-lg text-midnight-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Info Grid */}
              <div className="space-y-3 mb-4">
                {course.teacher_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <UserIcon className="w-4 h-4 text-midnight-500" />
                    <span className="text-midnight-300">{course.teacher_name}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <HashtagIcon className="w-4 h-4 text-midnight-500" />
                    <span className="text-midnight-400">Enrollment</span>
                  </div>
                  <span
                    className={`font-mono font-medium ${
                      hasAvailableSlots(course)
                        ? "text-accent-400"
                        : "text-rose-400"
                    }`}
                  >
                    {course.current_enrolled}/{course.max_capacity}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckBadgeIcon className="w-4 h-4 text-midnight-500" />
                    <span className="text-midnight-400">Auto-Enroll</span>
                  </div>
                  <span
                    className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                      course.auto_enroll
                        ? "bg-accent-500/20 text-accent-400"
                        : "bg-midnight-700/50 text-midnight-400"
                    }`}
                  >
                    {course.auto_enroll ? "Active" : "Off"}
                  </span>
                </div>
              </div>

              {/* Status & Action */}
              <div className="pt-4 border-t border-midnight-700/50">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                      course.is_enabled
                        ? "bg-accent-500/20 text-accent-400"
                        : "bg-midnight-700/50 text-midnight-400"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        course.is_enabled
                          ? "bg-accent-400 animate-pulse"
                          : "bg-midnight-500"
                      }`}
                    />
                    {course.is_enabled ? "Monitoring" : "Paused"}
                  </div>

                  <Button
                    variant={course.is_enabled ? "ghost" : "outline"}
                    size="sm"
                    className="ml-auto"
                    onClick={() =>
                      toggleMutation.mutate({
                        id: course.id,
                        is_enabled: !course.is_enabled,
                      })
                    }
                    isLoading={toggleMutation.isPending}
                  >
                    {course.is_enabled ? "Pause" : "Resume"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-500/10 border border-accent-500/30 mb-4">
              <AcademicCapIcon className="w-8 h-8 text-accent-400" />
            </div>
            <h3 className="text-lg font-semibold text-midnight-100 mb-2">
              No courses tracked
            </h3>
            <p className="text-midnight-400 mb-6 max-w-sm mx-auto">
              Start tracking courses to get notified when spots open up and
              automatically enroll.
            </p>
            <Button
              onClick={() => setIsAddingCourse(true)}
              leftIcon={<PlusIcon className="w-5 h-5" />}
            >
              Add Your First Course
            </Button>
          </div>
        </Card>
      )}

      {/* Add Course Modal */}
      {isAddingCourse && (
        <AddCourseModal
          accounts={accounts ?? []}
          onClose={() => setIsAddingCourse(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Course"
        message={`Are you sure you want to stop tracking "${courseToDelete?.course_name}"? This action cannot be undone.`}
        confirmText="Remove"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

function AddCourseModal({
  accounts,
  onClose,
}: {
  accounts: { id: string; student_id: string }[];
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<TrackedCourseCreate>({
    ntnu_account_id: accounts[0]?.id ?? "",
    course_code: "",
    course_name: "",
    teacher_name: "",
    auto_enroll: true,
  });

  const createMutation = useMutation({
    mutationFn: coursesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course Added", "Course is now being tracked.");
      onClose();
    },
    onError: (error: Error) => {
      toast.error("Failed to Add Course", error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const updateField = <K extends keyof TrackedCourseCreate>(
    field: K,
    value: TrackedCourseCreate[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Add Course to Track"
      description="Enter the course details to start monitoring availability."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NTNU Account Select */}
        <div>
          <label className="block text-sm font-medium text-midnight-200 mb-2">
            NTNU Account
          </label>
          <select
            className="w-full bg-midnight-800/50 border border-midnight-700/50 rounded-lg px-4 py-2.5 text-midnight-100 focus:outline-none focus:border-accent-500/50 input-glow transition-all"
            value={formData.ntnu_account_id}
            onChange={(e) => updateField("ntnu_account_id", e.target.value)}
            required
          >
            {accounts.length === 0 ? (
              <option value="">No accounts available</option>
            ) : (
              accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.student_id}
                </option>
              ))
            )}
          </select>
          {accounts.length === 0 && (
            <p className="mt-1.5 text-sm text-amber-400">
              Please add an NTNU account first.
            </p>
          )}
        </div>

        <Input
          label="Course Code"
          placeholder="e.g., CSC1234"
          value={formData.course_code}
          onChange={(e) => updateField("course_code", e.target.value)}
          required
        />

        <Input
          label="Course Name"
          placeholder="e.g., Introduction to Programming"
          value={formData.course_name}
          onChange={(e) => updateField("course_name", e.target.value)}
          required
        />

        <Input
          label="Teacher Name"
          placeholder="Optional"
          value={formData.teacher_name ?? ""}
          onChange={(e) => updateField("teacher_name", e.target.value)}
        />

        {/* Auto-enroll Toggle */}
        <label className="flex items-center gap-3 p-3 rounded-lg bg-midnight-800/30 border border-midnight-700/30 cursor-pointer hover:bg-midnight-800/50 transition-colors">
          <input
            type="checkbox"
            checked={formData.auto_enroll}
            onChange={(e) => updateField("auto_enroll", e.target.checked)}
            className="w-4 h-4 rounded border-midnight-600 bg-midnight-800 text-accent-500 focus:ring-accent-500/50 focus:ring-offset-0"
          />
          <div>
            <p className="text-sm font-medium text-midnight-200">
              Auto-enroll when available
            </p>
            <p className="text-xs text-midnight-500">
              Automatically register when a spot opens up
            </p>
          </div>
        </label>

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
            disabled={accounts.length === 0}
          >
            Add Course
          </Button>
        </div>
      </form>
    </Modal>
  );
}
