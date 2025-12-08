import type { Place } from "../App";
import { BottomNav } from "../components/bottom-nav";
import { Button } from "../components/ui/button";
import { ArrowLeft, Plus, MapPin, Star, Heart } from "lucide-react";

type WishlistPageProps = {
  places: Place[];
  onAddWishlist: () => void;
  onViewDetail: (place: Place) => void;
  onToggleWishlist: (placeId: string) => void;
  onNavigate: (page: "map" | "feed" | "calendar" | "mypage") => void;
};

export function WishlistPage({
  places,
  onAddWishlist,
  onViewDetail,
  onToggleWishlist,
  onNavigate,
}: WishlistPageProps) {
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("mypage")}
            className="text-gray-900"
          >
            <ArrowLeft size={24} />
          </button>
          <h1>가고 싶은 맛집</h1>
        </div>
        {/* 항상 보이는 + 버튼 (검색 화면으로 이동) */}
        <button
          onClick={onAddWishlist}
          className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white shadow-md"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {places.length === 0 ? (
          // ✅ 아무 맛집도 없을 때
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">
              아직 추가한 맛집이 없어요
            </h3>
            <p className="text-gray-500 mb-6">
              가고 싶은 맛집을 검색해서 추가해보세요
            </p>
            <Button
              onClick={onAddWishlist}
              className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              맛집 추가하기
            </Button>
          </div>
        ) : (
          // ✅ 이미 위시리스트가 있을 때
          <div className="p-4 space-y-3">
            {/* 리스트 위에도 “맛집 추가” 버튼 하나 더 */}
            <div className="flex justify-end mb-2">
              <Button
                onClick={onAddWishlist}
                variant="outline"
                className="border-pink-200 text-pink-600 hover:bg-pink-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                가고 싶은 맛집 추가
              </Button>
            </div>

            {places.map((place) => (
              <div
                key={place.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{place.name}</h3>
                    {place.address && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {place.address}
                      </p>
                    )}
                  </div>
                  {/* 위시리스트 해제 버튼 */}
                  <button
                    onClick={() => onToggleWishlist(place.id)}
                    className="text-pink-500"
                  >
                    <Heart className="w-5 h-5 fill-pink-500" />
                  </button>
                </div>

                {place.photos && place.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {place.photos.slice(0, 3).map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt=""
                        className="w-full h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{place.rating}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetail(place)}
                  >
                    상세보기
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentPage="mypage" onNavigate={onNavigate} />
    </div>
  );
}
