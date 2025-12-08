import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MoreVertical, Download, Filter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const tableData = [
  {
    id: "PRJ-001",
    name: "웹사이트 리디자인",
    assignee: {
      name: "김지훈",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kim",
    },
    status: "진행중",
    priority: "높음",
    dueDate: "2025-12-15",
    progress: 75,
  },
  {
    id: "PRJ-002",
    name: "모바일 앱 개발",
    assignee: {
      name: "이서연",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lee",
    },
    status: "진행중",
    priority: "중간",
    dueDate: "2026-01-20",
    progress: 45,
  },
  {
    id: "PRJ-003",
    name: "마케팅 캠페인",
    assignee: {
      name: "박민수",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Park",
    },
    status: "완료",
    priority: "낮음",
    dueDate: "2025-11-25",
    progress: 100,
  },
  {
    id: "PRJ-004",
    name: "데이터 분석 시스템",
    assignee: {
      name: "정수진",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jung",
    },
    status: "대기중",
    priority: "높음",
    dueDate: "2026-02-10",
    progress: 15,
  },
  {
    id: "PRJ-005",
    name: "고객 지원 포털",
    assignee: {
      name: "최영희",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Choi",
    },
    status: "진행중",
    priority: "중간",
    dueDate: "2025-12-28",
    progress: 60,
  },
  {
    id: "PRJ-006",
    name: "인프라 업그레이드",
    assignee: {
      name: "강태민",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kang",
    },
    status: "검토중",
    priority: "높음",
    dueDate: "2026-01-05",
    progress: 30,
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "완료":
      return "default";
    case "진행중":
      return "secondary";
    case "대기중":
      return "outline";
    case "검토중":
      return "outline";
    default:
      return "secondary";
  }
};

const getPriorityVariant = (priority: string) => {
  switch (priority) {
    case "높음":
      return "destructive";
    case "중간":
      return "default";
    case "낮음":
      return "secondary";
    default:
      return "secondary";
  }
};

export function ItemsTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>프로젝트 목록</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              필터
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              내보내기
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>프로젝트 ID</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>담당자</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>우선순위</TableHead>
                <TableHead>마감일</TableHead>
                <TableHead>진행률</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={item.assignee.avatar} />
                        <AvatarFallback>
                          {item.assignee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{item.assignee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityVariant(item.priority)}>
                      {item.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.dueDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-gray-600 min-w-[3rem]">
                        {item.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>상세보기</DropdownMenuItem>
                        <DropdownMenuItem>편집</DropdownMenuItem>
                        <DropdownMenuItem>공유</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
