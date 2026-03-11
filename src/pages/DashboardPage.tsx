import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  AcademicCapIcon,
  CheckBadgeIcon,
  SignalIcon,
  UserGroupIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Card from "../components/ui/Card";
import { PageSpinner } from "../components/ui/Spinner";
import { OperationLogs } from "../components/OperationLogs";
import { coursesApi } from "../api/courses";
import { ntnuAccountsApi } from "../api/ntnu-accounts";

interface StatCardProps {
  name: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  delay: number;
}

function StatCard({ name, value, icon: Icon, color, bgColor, delay }: StatCardProps) {
  return (
    <Card
      hoverable
      glowOnHover
      className="animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <p className="text-sm text-midnight-400">{name}</p>
          <p className="text-2xl font-bold text-midnight-100">{value}</p>
        </div>
      </div>
    </Card>
  );
}

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
    return <PageSpinner label="Loading dashboard..." />;
  }

  const enabledCourses = courses?.filter((c) => c.is_enabled).length ?? 0;
  const autoEnrollCourses = courses?.filter((c) => c.auto_enroll).length ?? 0;
  const activeAccounts = accounts?.filter((a) => a.is_active).length ?? 0;

  const stats: Omit<StatCardProps, "delay">[] = [
    {
      name: "Tracked Courses",
      value: courses?.length ?? 0,
      icon: AcademicCapIcon,
      color: "text-accent-400",
      bgColor: "bg-accent-500/20",
    },
    {
      name: "Auto-Enroll Active",
      value: autoEnrollCourses,
      icon: CheckBadgeIcon,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
    },
    {
      name: "Monitoring",
      value: enabledCourses,
      icon: SignalIcon,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
    },
    {
      name: "NTNU Accounts",
      value: activeAccounts,
      icon: UserGroupIcon,
      color: "text-violet-400",
      bgColor: "bg-violet-500/20",
    },
  ];

  const hasAvailableSlots = (current: number, max: number) => current < max;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-midnight-100">Dashboard</h1>
          <p className="text-midnight-400 mt-1">Overview of your course tracking</p>
        </div>
        <Link
          to="/courses"
          className="flex items-center gap-2 text-sm text-accent-400 hover:text-accent-300 transition-colors"
        >
          View all courses
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.name} {...stat} delay={index * 50} />
        ))}
      </div>

      {/* Two column layout for courses and logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-midnight-100">
              Tracked Courses
            </h2>
            {courses && courses.length > 5 && (
              <Link
                to="/courses"
                className="text-sm text-accent-400 hover:text-accent-300"
              >
                View all
              </Link>
            )}
          </div>

          {courses && courses.length > 0 ? (
            <div className="space-y-2">
              {courses.slice(0, 5).map((course, index) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-midnight-800/30 hover:bg-midnight-800/50 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-midnight-100 truncate">
                      {course.course_name}
                    </p>
                    <p className="text-sm text-midnight-500 font-mono">
                      {course.course_code}
                      {course.teacher_name && (
                        <span className="text-midnight-600"> - {course.teacher_name}</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p
                      className={`text-sm font-mono font-medium ${
                        hasAvailableSlots(course.current_enrolled, course.max_capacity)
                          ? "text-accent-400"
                          : "text-rose-400"
                      }`}
                    >
                      {course.current_enrolled}/{course.max_capacity}
                    </p>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          course.is_enabled
                            ? "bg-accent-400 animate-pulse"
                            : "bg-midnight-600"
                        }`}
                      />
                      <span className="text-xs text-midnight-500">
                        {course.is_enabled ? "Monitoring" : "Paused"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-midnight-800/50 mb-3">
                <SparklesIcon className="w-6 h-6 text-midnight-500" />
              </div>
              <p className="text-midnight-400 mb-3">
                No courses being tracked yet.
              </p>
              <Link
                to="/courses"
                className="text-accent-400 hover:text-accent-300 text-sm font-medium"
              >
                Add your first course
              </Link>
            </div>
          )}
        </Card>

        {/* Operation Logs - Live monitoring */}
        <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <h2 className="text-lg font-semibold text-midnight-100 mb-4">
            Live Operation Monitor
          </h2>
          <OperationLogs maxHeight="320px" devMode={true} />
        </div>
      </div>
    </div>
  );
}
