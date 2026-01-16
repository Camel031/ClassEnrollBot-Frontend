import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { coursesApi } from "../api/courses";
import { ntnuAccountsApi } from "../api/ntnu-accounts";
import { TrackedCourse, TrackedCourseCreate } from "../types";

export default function CoursesPage() {
  const [isAddingCourse, setIsAddingCourse] = useState(false);
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
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_enabled }: { id: string; is_enabled: boolean }) =>
      coursesApi.update(id, { is_enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  const handleDelete = (course: TrackedCourse) => {
    if (confirm(`Delete tracking for "${course.course_name}"?`)) {
      deleteMutation.mutate(course.id);
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
        <h1 className="text-2xl font-bold text-gray-900">Tracked Courses</h1>
        <Button onClick={() => setIsAddingCourse(true)}>
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Course
        </Button>
      </div>

      {courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card key={course.id}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {course.course_name}
                  </h3>
                  <p className="text-sm text-gray-600">{course.course_code}</p>
                </div>
                <button
                  onClick={() => handleDelete(course)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>

              {course.teacher_name && (
                <p className="text-sm text-gray-600 mb-2">
                  Teacher: {course.teacher_name}
                </p>
              )}

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Enrollment</span>
                <span className="font-medium">
                  {course.current_enrolled}/{course.max_capacity}
                </span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Auto-Enroll</span>
                <span
                  className={`text-sm font-medium ${
                    course.auto_enroll ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {course.auto_enroll ? "Enabled" : "Disabled"}
                </span>
              </div>

              <div className="pt-3 border-t">
                <Button
                  variant={course.is_enabled ? "secondary" : "primary"}
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    toggleMutation.mutate({
                      id: course.id,
                      is_enabled: !course.is_enabled,
                    })
                  }
                  isLoading={toggleMutation.isPending}
                >
                  {course.is_enabled ? "Pause Monitoring" : "Resume Monitoring"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <AcademicCapIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses tracked
            </h3>
            <p className="text-gray-600 mb-4">
              Start tracking courses to get notified when spots open up.
            </p>
            <Button onClick={() => setIsAddingCourse(true)}>
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Your First Course
            </Button>
          </div>
        </Card>
      )}

      {/* Add Course Modal would go here */}
      {isAddingCourse && (
        <AddCourseModal
          accounts={accounts || []}
          onClose={() => setIsAddingCourse(false)}
        />
      )}
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
    ntnu_account_id: accounts[0]?.id || "",
    course_code: "",
    course_name: "",
    teacher_name: "",
    auto_enroll: true,
  });

  const createMutation = useMutation({
    mutationFn: coursesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold mb-4">Add Course to Track</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NTNU Account
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={formData.ntnu_account_id}
              onChange={(e) =>
                setFormData({ ...formData, ntnu_account_id: e.target.value })
              }
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.student_id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Code
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={formData.course_code}
              onChange={(e) =>
                setFormData({ ...formData, course_code: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Name
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={formData.course_name}
              onChange={(e) =>
                setFormData({ ...formData, course_name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teacher Name (Optional)
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={formData.teacher_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, teacher_name: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="auto_enroll"
              checked={formData.auto_enroll}
              onChange={(e) =>
                setFormData({ ...formData, auto_enroll: e.target.checked })
              }
            />
            <label htmlFor="auto_enroll" className="text-sm text-gray-700">
              Automatically enroll when spot opens
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={createMutation.isPending}
            >
              Add Course
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

import { AcademicCapIcon } from "@heroicons/react/24/outline";
