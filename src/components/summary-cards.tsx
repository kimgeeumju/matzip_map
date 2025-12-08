import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Clock, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

const projects = [
  {
    title: "웹사이트 리디자인",
    status: "진행중",
    progress: 75,
    dueDate: "2025-12-15",
    priority: "높음",
    statusColor: "bg-blue-500",
  },
  {
    title: "모바일 앱 개발",
    status: "진행중",
    progress: 45,
    dueDate: "2026-01-20",
    priority: "중간",
    statusColor: "bg-blue-500",
  },
  {
    title: "마케팅 캠페인",
    status: "완료",
    progress: 100,
    dueDate: "2025-11-25",
    priority: "낮음",
    statusColor: "bg-green-500",
  },
  {
    title: "데이터 분석 시스템",
    status: "대기중",
    progress: 15,
    dueDate: "2026-02-10",
    priority: "높음",
    statusColor: "bg-yellow-500",
  },
];

const recentActivities = [
  {
    user: "김지훈",
    action: "새 프로젝트를 생성했습니다",
    project: "웹사이트 리디자인",
    time: "10분 전",
  },
  {
    user: "이서연",
    action: "작업을 완료했습니다",
    project: "마케팅 캠페인",
    time: "1시간 전",
  },
  {
    user: "박민수",
    action: "댓글을 추가했습니다",
    project: "모바일 앱 개발",
    time: "2시간 전",
  },
  {
    user: "정수진",
    action: "파일을 업로드했습니다",
    project: "데이터 분석 시스템",
    time: "3시간 전",
  },
];

export function SummaryCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Projects Overview */}
      <Card>
        <CardHeader>
          <CardTitle>프로젝트 현황</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {projects.map((project) => (
            <div key={project.title} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${project.statusColor}`} />
                  <span className="text-gray-900">{project.title}</span>
                </div>
                <Badge
                  variant={
                    project.priority === "높음"
                      ? "destructive"
                      : project.priority === "중간"
                      ? "default"
                      : "secondary"
                  }
                >
                  {project.priority}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={project.progress} className="flex-1" />
                <span className="text-gray-600 min-w-[3rem]">{project.progress}%</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {project.dueDate}
                </span>
                <span className="text-gray-400">·</span>
                <span>{project.status}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
                  {activity.user.charAt(0)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900">
                  <span>{activity.user}</span>{" "}
                  <span className="text-gray-600">{activity.action}</span>
                </p>
                <p className="text-gray-600">{activity.project}</p>
                <p className="text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>주요 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-900">완료된 작업</p>
                <p className="text-gray-600">156개 작업</p>
                <p className="text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  +12% 이번 달
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-900">진행중인 작업</p>
                <p className="text-gray-600">23개 작업</p>
                <p className="text-blue-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  +5% 이번 달
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-orange-50 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-900">기한 임박</p>
                <p className="text-gray-600">8개 작업</p>
                <p className="text-orange-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  주의 필요
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
