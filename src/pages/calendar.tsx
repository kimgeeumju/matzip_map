import { useState } from "react";
import type { Place } from "../App";
import { BottomNav } from "../components/bottom-nav";
import { PlaceCard } from "../components/place-card";
import { Button } from "../components/ui/button";
import { ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";

type CalendarPageProps = {
  places: Place[];
  onViewDetail: (place: Place) => void;
  onNavigate: (page: "map" | "feed" | "calendar") => void;
};

export function CalendarPage({
  places,
  onViewDetail,
  onNavigate,
}: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  // 방문한 곳만 필터링 (위시리스트 제외)
  const visitedPlaces = places.filter((place) => !place.isWishlist);

  const getPlacesForDate = (date: string) => {
    return visitedPlaces.filter((place) => place.date === date);
  };

  const hasPlaces = (day: number) => {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return getPlacesForDate(date).length > 0;
  };

  const selectedPlaces = selectedDate ? getPlacesForDate(selectedDate) : [];

  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월",
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">
            {`${year}년 ${monthNames[month]}`}
          </h1>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar - 방문한 곳만 표시 */}
      <div className="flex-shrink-0 px-4 py-6 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto">
          {/* 요일 */}
          <div className="grid grid-cols-7 gap-1.5 mb-3">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div
                key={day}
                className="text-xs text-gray-500 text-center py-1.5 font-medium"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-1.5">
            {[...Array(firstDayOfMonth)].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
                day
              ).padStart(2, "0")}`;
              const isSelected = selectedDate === date;
              const placesCount = getPlacesForDate(date).length;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? "bg-gradient-to-br from-pink-500 to-red-500 text-white shadow-md scale-105"
                      : placesCount > 0
                      ? "bg-pink-50 text-gray-900 border-2 border-pink-200 hover:bg-pink-100 hover:scale-105"
                      : "text-gray-500 hover:bg-gray-100 hover:scale-105 hover:text-gray-900"
                  }`}
                >
                  <span className="text-xs">{day}</span>
                  {placesCount > 0 && (
                    <div
                      className={`mt-0.5 w-2 h-2 rounded-full ${
                        isSelected ? "bg-white" : "bg-pink-500"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Places List - 방문한 곳만 표시 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
        {selectedDate ? (
          selectedPlaces.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedDate.replace(/-/g, ".")}
                </h2>
                <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full font-medium">
                  {selectedPlaces.length}
                </span>
              </div>
              
              {/* 컴팩트 리스트 */}
              <div className="space-y-2">
                {selectedPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="bg-white rounded-xl p-3 border border-gray-200 hover:shadow-sm transition-shadow flex items-start gap-3 cursor-pointer"
                    onClick={() => onViewDetail(place)}
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">
                        {place.category === "RED" ? "🍽️" :
                         place.category === "YELLOW" ? "🍝" :
                         place.category === "GREEN" ? "🥗" : "🍣"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{place.name}</h3>
                      <p className="text-xs text-gray-500 mb-1 truncate">{place.address}</p>
                      {place.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                          <span className="text-xs text-gray-600 font-medium">{place.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-4 flex items-center justify-center">
                <MapPin className="w-8 h-8" />
              </div>
              <p className="text-lg mb-2">방문한 맛집이 없습니다</p>
              <p className="text-sm">다녀온 맛집을 등록해보세요</p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-red-100 rounded-3xl mb-6 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-pink-500" />
            </div>
            <p className="text-xl font-medium mb-2">날짜를 선택하세요</p>
            <p className="text-sm">달력에서 방문한 날짜를 터치하면<br />해당 날짜의 맛집을 확인할 수 있습니다</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentPage="calendar" onNavigate={onNavigate} />
    </div>
  );
}
