import { useState } from "react";
import type { Place } from "../App";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { ArrowLeft, Star, MapPin } from "lucide-react";

type CollectionAddPlacesPageProps = {
  places: Place[];
  onComplete: (placeIds: string[]) => void;
  onBack: () => void;
};

export function CollectionAddPlacesPage({
  places,
  onComplete,
  onBack,
}: CollectionAddPlacesPageProps) {
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);

  const handleTogglePlace = (placeId: string) => {
    setSelectedPlaceIds((prev) =>
      prev.includes(placeId)
        ? prev.filter((id) => id !== placeId)
        : [...prev, placeId]
    );
  };

  const handleComplete = () => {
    onComplete(selectedPlaceIds);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-900">
            <ArrowLeft size={24} />
          </button>
          <h1>맛집 선택</h1>
        </div>
        <span className="text-sm text-gray-500">
          {selectedPlaceIds.length}개 선택
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {places.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-500">등록된 맛집이 없습니다</p>
            <p className="text-sm text-gray-400 mt-2">
              먼저 맛집을 등록해주세요
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {places.map((place) => (
              <label
                key={place.id}
                className={`block bg-white border rounded-xl p-4 cursor-pointer transition-colors ${
                  selectedPlaceIds.includes(place.id)
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedPlaceIds.includes(place.id)}
                    onCheckedChange={() => handleTogglePlace(place.id)}
                  />
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{place.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {place.rating}
                      </span>
                      <span>{place.date}</span>
                    </div>
                    {place.memo && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {place.memo}
                      </p>
                    )}
                  </div>
                  {place.photos && place.photos.length > 0 && (
                    <img
                      src={place.photos[0]}
                      alt={place.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={handleComplete}
          disabled={selectedPlaceIds.length === 0}
          className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 disabled:opacity-50"
        >
          완료 ({selectedPlaceIds.length}개 추가)
        </Button>
      </div>
    </div>
  );
}
