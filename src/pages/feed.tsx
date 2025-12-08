import { useState, useEffect, useRef, useMemo } from "react";
import type { Place } from "../App";
import { BottomNav } from "../components/bottom-nav";
import { PlaceCard } from "../components/place-card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, Heart } from "lucide-react";

type FeedPageProps = {
  places: Place[];
  onViewDetail: (place: Place) => void;
  // 🔻 여기 "mypage" 포함 (BottomNav와 App 둘 다와 맞추기)
  onNavigate: (
    page: "map" | "feed" | "calendar" | "detail" | "mypage",
  ) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: (show: boolean) => void;
  onTogglePlaceFavorite: (placeId: string) => void;
};

// 🔥 여기 named export가 중요
export function FeedPage({
  places,
  onViewDetail,
  onNavigate,
  showFavoritesOnly,
  onToggleFavorites,
  onTogglePlaceFavorite,
}: FeedPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedPlaces, setDisplayedPlaces] = useState<
    Place[]
  >([]);
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 6;

  const filteredPlaces = useMemo(() => {
    return places
      .filter((place) => {
        if (
          searchQuery &&
          !place.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        if (showFavoritesOnly && !place.isFavorite) {
          return false;
        }
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime(),
      );
  }, [places, searchQuery, showFavoritesOnly]);

  useEffect(() => {
    setDisplayedPlaces(
      filteredPlaces.slice(0, page * ITEMS_PER_PAGE),
    );
  }, [page, filteredPlaces, ITEMS_PER_PAGE]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          displayedPlaces.length < filteredPlaces.length
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [displayedPlaces.length, filteredPlaces.length]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, showFavoritesOnly]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-gray-900">피드</h1>
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={() =>
              onToggleFavorites(!showFavoritesOnly)
            }
            className={
              showFavoritesOnly
                ? "bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                : ""
            }
          >
            <Heart
              className={`w-4 h-4 mr-2 ${
                showFavoritesOnly ? "fill-white" : ""
              }`}
            />
            즐겨찾기
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="search"
            placeholder="맛집 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Feed Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {displayedPlaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Heart className="w-16 h-16 mb-4" />
            <p>등록된 맛집이 없습니다</p>
            <p className="text-sm">
              지도에서 맛집을 등록해보세요!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onViewDetail={() => onViewDetail(place)}
                  onToggleFavorite={() =>
                    onTogglePlaceFavorite(place.id)
                  }
                />
              ))}
            </div>
            {displayedPlaces.length < filteredPlaces.length && (
              <div ref={loaderRef} className="py-8 text-center">
                <div className="inline-block w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentPage="feed" onNavigate={onNavigate} />
    </div>
  );
}