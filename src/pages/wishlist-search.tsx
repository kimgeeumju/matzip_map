import { useState } from "react";
import type { Place } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ArrowLeft, Search, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";

type WishlistSearchPageProps = {
  onAddPlace: (place: Place) => void;
  onBack: () => void;
};

type SearchResultPlace = Omit<
  Place,
  "id" | "date" | "photos" | "isFavorite" | "isWishlist" | "memo"
>;

// Mock 데이터는 이제 안 써도 되지만, 필요하면 남겨둬도 상관 없음
// const MOCK_SEARCH_RESULTS: SearchResultPlace[] = [ ... ];

export function WishlistSearchPage({
  onAddPlace,
  onBack,
}: WishlistSearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultPlace[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    if (
      !window.kakao ||
      !window.kakao.maps ||
      !window.kakao.maps.services
    ) {
      toast.error("카카오 지도 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      const ps = new window.kakao.maps.services.Places();

      ps.keywordSearch(searchQuery, (data: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const results: SearchResultPlace[] = data.slice(0, 10).map((place: any) => ({
            name: place.place_name,
            category: "RED", // 필요시 카테고리 매핑
            rating: 0,
            lat: parseFloat(place.y),
            lng: parseFloat(place.x),
            address: place.address_name || place.road_address_name || "",
          }));
          setSearchResults(results);
        } else if (
          status === window.kakao.maps.services.Status.ZERO_RESULT
        ) {
          setSearchResults([]);
          toast.info("검색 결과가 없습니다.");
        } else {
          toast.error("검색 중 오류가 발생했습니다.");
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("검색 중 오류 발생");
    }
  };

  const handleAddPlace = (place: SearchResultPlace) => {
    const newPlace: Place = {
      ...place,
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      photos: [],
      isFavorite: false,
      isWishlist: true,
      memo: "",
    };
    onAddPlace(newPlace);
  toast.success(`${place.name}을(를) 위시리스트에 추가했습니다`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
        <button onClick={onBack} className="text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h1>맛집 검색</h1>
      </div>

      {/* Search Bar */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="text"
              placeholder="맛집 이름이나 주소를 검색하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>검색</Button>
        </div>
      </div>

      {/* Search Results */}
      <div className="p-4">
        {searchResults.length === 0 && searchQuery && (
          <div className="py-12 text-center text-gray-500">
            검색 결과가 없습니다
          </div>
        )}

        {searchResults.length === 0 && !searchQuery && (
          <div className="py-12 text-center text-gray-500">
            가고 싶은 맛집을 검색해보세요
          </div>
        )}

        <div className="space-y-3">
          {searchResults.map((place, index) => (
            <div
              key={index}
              className="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex-1">
                <h3 className="mb-1 text-gray-900">{place.name}</h3>
                <p className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3 w-3" />
                  {place.address}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => handleAddPlace(place)}
                className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
              >
                <Plus className="mr-1 h-4 w-4" />
                추가
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
