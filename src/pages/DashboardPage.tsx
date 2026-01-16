import { useQuery } from "@tanstack/react-query";
import {
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import { coursesApi } from "../api/courses";
import { ntnuAccountsApi } from "../api/ntnu-accounts";

export default function DashboardPage() {
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: coursesApi.getAll,
  });

  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ["ntnu-accounts"],
    queryFn: ntnuAccountsApi.getAll,
  });

  if (coursesLoading || accountsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const enabledCourses = courses?.filter((c) => c.is_enabled).length || 0;
  const autoEnrollCourses = courses?.filter((c) => c.auto_enroll).length || 0;
  const activeAccounts = accounts?.filter((a) => a.is_active).length || 0;

  const stats = [
    {
      name: "Tracked Courses",
      value: courses?.length || 0,
      icon: AcademicCapIcon,
      color: "text-blue-600 bg-blue-100",
    },
    {
      name: "Auto-Enroll Active",
      value: autoEnrollCourses,
      icon: CheckCircleIcon,
      color: "text-green-600 bg-green-100",
    },
    {
      name: "Monitoring",
      value: enabledCourses,
      icon: ClockIcon,
      color: "text-yellow-600 bg-yellow-100",
    },
    {
      name: "NTNU Accounts",
      value: activeAccounts,
      icon: ExclamationCircleIcon,
      color: "text-purple-600 bg-purple-100",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Courses */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Tracked Courses
        </h2>
        {courses && courses.length > 0 ? (
          <div className="space-y-3">
            {courses.slice(0, 5).map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {course.course_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {course.course_code}
                    {course.teacher_name && ` - ${course.teacher_name}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {course.current_enrolled}/{course.max_capacity}
                  </p>
                  <p className="text-xs text-gray-500">
                    {course.is_enabled ? "Monitoring" : "Paused"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No courses being tracked yet. Add your first course to get started.
          </p>
        )}
      </Card>
    </div>
  );
}
