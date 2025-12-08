import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, Users, Folder, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { month: "1월", value: 2400, users: 1400 },
  { month: "2월", value: 1398, users: 2210 },
  { month: "3월", value: 9800, users: 2290 },
  { month: "4월", value: 3908, users: 2000 },
  { month: "5월", value: 4800, users: 2181 },
  { month: "6월", value: 3800, users: 2500 },
  { month: "7월", value: 4300, users: 2100 },
];

const stats = [
  {
    title: "총 수익",
    value: "₩45,231,890",
    change: "+20.1%",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "활성 사용자",
    value: "2,350",
    change: "+12.5%",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "프로젝트",
    value: "48",
    change: "+8.2%",
    icon: Folder,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "활동",
    value: "1,234",
    change: "+3.1%",
    icon: Activity,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

export function HeroPanel() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-2">대시보드 개요</h1>
        <p className="text-gray-600">프로젝트 성과와 주요 지표를 확인하세요</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-gray-600">{stat.title}</p>
                    <p className="text-gray-900">{stat.value}</p>
                    <p className={`${stat.color} flex items-center gap-1`}>
                      <TrendingUp className="w-4 h-4" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>성과 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorValue)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorUsers)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
