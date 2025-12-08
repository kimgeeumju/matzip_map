import { Map, LayoutGrid, Calendar, User } from "lucide-react";

type BottomNavProps = {
  currentPage: "map" | "feed" | "calendar" | "mypage";
  onNavigate: (page: "map" | "feed" | "calendar" | "mypage") => void;
};

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    { page: "map" as const, icon: Map, label: "지도" },
    { page: "feed" as const, icon: LayoutGrid, label: "피드" },
    { page: "calendar" as const, icon: Calendar, label: "캘린더" },
    { page: "mypage" as const, icon: User, label: "마이페이지" },
  ];

  return (
    <nav className="bg-white border-t border-gray-200">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ page, icon: Icon, label }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              currentPage === page
                ? "text-pink-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}