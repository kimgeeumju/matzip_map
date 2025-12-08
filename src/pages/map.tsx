import { useState } from "react";
import { MapContainer } from "../components/map-container";
import { PlaceFormDialog } from "../components/place-form-dialog";
import { BottomNav } from "../components/bottom-nav";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import type { Place } from "../App";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";

type MapPageProps = {
  places: Place[];
  onAddPlace: (place: Place) => void;
  onViewDetail: (place: Place) => void;
  onNavigate: (
    page:
      | "map"
      | "map-search"
      | "feed"
      | "calendar"
      | "mypage"
      | "wishlist"
      | "wishlist-search"
      | "collection-detail"
      | "collection-create"
      | "collection-add-places",
  ) => void;
  filterCategories: string[];
  onFilterChange: (categories: string[]) => void;
};

const CATEGORIES = [
  { value: "RED", label: "한식", color: "bg-red-500" },
  { value: "YELLOW", label: "양식", color: "bg-yellow-500" },
  { value: "GREEN", label: "중식", color: "bg-green-500" },
  { value: "BLUE", label: "일식", color: "bg-blue-500" },
  { value: "PURPLE", label: "기타", color: "bg-purple-500" },
];

export function MapPage({
  places,
  onAddPlace,
  onViewDetail,
  onNavigate,
  filterCategories,
  onFilterChange,
}: MapPageProps) {
  const [showPlaceForm, setShowPlaceForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    name?: string;
    address?: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ 이제 이름/주소까지 같이 받음
  const handleMapClick = (location: {
    lat: number;
    lng: number;
    name?: string;
    address?: string;
  }) => {
    setSelectedLocation(location);
    setShowPlaceForm(true);
  };

  const handleAddPlace = (place: Place) => {
    onAddPlace(place);
    setShowPlaceForm(false);
    setSelectedLocation(null);
  };

  const handleToggleCategory = (category: string) => {
    if (filterCategories.includes(category)) {
      onFilterChange(
        filterCategories.filter((c) => c !== category),
      );
    } else {
      onFilterChange([...filterCategories, category]);
    }
  };

  // 검색 + 카테고리 필터
  const filteredPlaces = places.filter((place) => {
    const matchCategory =
      filterCategories.length === 0 ||
      filterCategories.includes(place.category);

    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      q === "" ||
      place.name.toLowerCase().includes(q) ||
      (place.address
        ? place.address.toLowerCase().includes(q)
        : false);

    return matchCategory && matchSearch;
  });

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="space-y-3 border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="search"
              placeholder="음식점 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative"
              >
                <Filter className="h-4 w-4" />
                {filterCategories.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-xs text-white">
                    {filterCategories.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>필터</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="mb-3">카테고리</h3>
                  <div className="space-y-3">
                    {CATEGORIES.map((category) => (
                      <div
                        key={category.value}
                        className="flex items-center gap-3"
                      >
                        <Checkbox
                          id={category.value}
                          checked={filterCategories.includes(
                            category.value,
                          )}
                          onCheckedChange={() =>
                            handleToggleCategory(
                              category.value,
                            )
                          }
                        />
                        <Label
                          htmlFor={category.value}
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <div
                            className={`h-4 w-4 rounded-full ${category.color}`}
                          />
                          {category.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                {filterCategories.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => onFilterChange([])}
                    className="w-full"
                  >
                    필터 초기화
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("map-search")}
            className="hidden sm:inline-flex"
          >
            검색으로 추가
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-1">
        <MapContainer
          places={filteredPlaces}
          onMapClick={handleMapClick}
          onMarkerClick={onViewDetail}
          searchQuery={searchQuery}
        />
        <Button
          onClick={() => setShowPlaceForm(true)}
          className="absolute bottom-20 right-4 h-14 w-14 rounded-full bg-gradient-to-r from-pink-500 to-red-500 shadow-lg hover:from-pink-600 hover:to-red-600"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <BottomNav currentPage="map" onNavigate={onNavigate} />

      <PlaceFormDialog
        open={showPlaceForm}
        onOpenChange={setShowPlaceForm}
        onSubmit={handleAddPlace}
        initialLocation={selectedLocation}
      />
    </div>
  );
}
