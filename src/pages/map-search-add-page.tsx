// src/pages/map-search-add-page.tsx

import { useState } from "react";
import type { Place } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ArrowLeft, Search, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { PlaceFormDialog } from "../components/place-form-dialog";

declare global {
  interface Window {
    kakao: any;
  }
}

type MapSearchAddPageProps = {
  onAddPlace: (place: Place) => void;
  onBack: () => void;
};

type SearchResult = {
  name: string;
  lat: number;
  lng: number;
  address: string;
};

export function MapSearchAddPage({
  onAddPlace,
  onBack,
}: MapSearchAddPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showPlaceForm, setShowPlaceForm] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

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
      toast.error(
        "카카오 지도 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
      );
      return;
    }

    try {
      const ps = new window.kakao.maps.services.Places();

      ps.keywordSearch(searchQuery, (data: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const results: SearchResult[] = data.slice(0, 15).map((place: any) => ({
            name: place.place_name,
            lat: parseFloat(place.y),
            lng: parseFloat(place.x),
            address: place.address_name || place.road_address_name || "",
          }));
          setSearchResults(results);
          if (results.length === 0) {
            toast.info("검색 결과가 없습니다.");
          }
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
      toast.error("검색 중 오류가 발생했습니다.");
    }
  };

  // 검색 결과에서 "추가" 버튼 → 상세입력 폼 열기
  const handleOpenForm = (result: SearchResult) => {
    const draft: Place = {
      id: "", // App에서 새로 id 부여하니까 여기선 비워둠
      name: result.name,
      date: new Date().toISOString().split("T")[0],
      rating: 5,
      category: "RED",
      lat: result.lat,
      lng: result.lng,
      photos: [],
      memo: "",
      isFavorite: false,
      isWishlist: false,
      address: result.address,
    };

    setSelectedPlace(draft);
    setShowPlaceForm(true);
  };

  // PlaceFormDialog에서 저장 눌렀을 때
  const handleSubmitPlace = (place: Place) => {
    const fixed: Place = {
      ...place,
      id: Date.now().toString(), // 여기서 실제 id 부여
    };
    onAddPlace(fixed);
    setShowPlaceForm(false);
    setSelectedPlace(null);
    toast.success(`${place.name}이(가) 맛집 목록에 추가됐어요!`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
        <button onClick={onBack} className="text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-base font-semibold">맛집 검색해서 추가</h1>
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
        {searchResults.length === 0 && !searchQuery && (
          <div className="py-12 text-center text-gray-500">
            지도가 아니라 검색으로도 맛집을 추가할 수 있어요
          </div>
        )}

        {searchResults.length === 0 && searchQuery && (
          <div className="py-12 text-center text-gray-500">
            검색 결과가 없습니다
          </div>
        )}

        <div className="space-y-3">
          {searchResults.map((place, index) => (
            <div
              key={index}
              className="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
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
                onClick={() => handleOpenForm(place)}
                className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
              >
                <Plus className="mr-1 h-4 w-4" />
                추가
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 검색 결과에서 뜨는 맛집 등록 팝업 */}
      <PlaceFormDialog
        open={showPlaceForm}
        onOpenChange={setShowPlaceForm}
        onSubmit={handleSubmitPlace}
        initialLocation={
          selectedPlace
            ? { lat: selectedPlace.lat, lng: selectedPlace.lng }
            : null
        }
        initialPlace={selectedPlace ?? undefined}
      />
    </div>
  );
}
