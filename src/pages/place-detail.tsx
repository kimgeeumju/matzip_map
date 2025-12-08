import { useState } from "react";
import type { Place } from "../App";
import { Button } from "../components/ui/button";
import { PlaceFormDialog } from "../components/place-form-dialog";
import {
  ArrowLeft,
  Heart,
  Star,
  Calendar,
  MapPin,
  Edit2,
  Trash2,
  Navigation,
  Share2, // 👈 공유 아이콘 추가
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

type PlaceDetailPageProps = {
  place: Place;
  onUpdate: (place: Place) => void;
  onDelete: (placeId: string) => void;
  onBack: () => void;
  onViewLocation: (place: Place) => void;
};

const CATEGORY_COLORS = {
  RED: "bg-red-500",
  YELLOW: "bg-yellow-500",
  GREEN: "bg-green-500",
  BLUE: "bg-blue-500",
  PURPLE: "bg-purple-500",
};

// 공유 텍스트에서 쓸 카테고리 이름
const CATEGORY_NAMES: Record<
  keyof typeof CATEGORY_COLORS,
  string
> = {
  RED: "한식",
  YELLOW: "양식",
  GREEN: "중식",
  BLUE: "일식",
  PURPLE: "카페/기타",
};

export function PlaceDetailPage({
  place,
  onUpdate,
  onDelete,
  onBack,
  onViewLocation,
}: PlaceDetailPageProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleToggleFavorite = () => {
    onUpdate({ ...place, isFavorite: !place.isFavorite });
  };

  const handleDelete = () => {
    onDelete(place.id);
  };

  // 🔻 카카오맵 길찾기 URL
  const kakaoMapUrl = `https://map.kakao.com/link/to/${encodeURIComponent(
    place.name,
  )},${place.lat},${place.lng}`;

  // 🔻 공유 / 링크 복사 핸들러
  const handleShare = async () => {
    const categoryName =
      CATEGORY_NAMES[
        place.category as keyof typeof CATEGORY_NAMES
      ] ?? "기타";

    const ratingText = `${place.rating}.0`; // 지금은 정수 평점이라 이렇게
    const memoText = place.memo ? `메모: ${place.memo}\n` : "";

    const shareText = `[${place.name}]
⭐ ${ratingText} / 카테고리: ${categoryName}
${memoText}위치: ${kakaoMapUrl}`;

    try {
      if (
        navigator.clipboard &&
        navigator.clipboard.writeText
      ) {
        await navigator.clipboard.writeText(shareText);
        alert(
          "맛집 정보가 클립보드에 복사되었어요! 붙여넣기해서 보내면 돼요 😊",
        );
      } else {
        // 구형 브라우저용 fallback
        const textarea = document.createElement("textarea");
        textarea.value = shareText;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        alert(
          "맛집 정보가 클립보드에 복사되었어요! 붙여넣기해서 보내면 돼요 😊",
        );
      }
    } catch (err) {
      console.error(err);
      alert(
        "클립보드 복사에 실패했어요. 다시 한 번 시도해 주세요.",
      );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Image Gallery */}
        {place.photos.length > 0 && (
          <div className="relative">
            <div className="aspect-[4/3] bg-gray-100">
              <ImageWithFallback
                src={place.photos[selectedImage]}
                alt={place.name}
                className="w-full h-full object-cover"
              />
            </div>
            {place.photos.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {place.photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === selectedImage
                        ? "bg-white w-6"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            )}
            <button
              onClick={handleToggleFavorite}
              className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <Heart
                className={`w-6 h-6 ${
                  place.isFavorite
                    ? "fill-pink-500 text-pink-500"
                    : "text-gray-400"
                }`}
              />
            </button>
          </div>
        )}

        {/* Info */}
        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-gray-900 flex-1">
                {place.name}
              </h1>
              <div
                className={`${
                  CATEGORY_COLORS[place.category]
                } w-4 h-4 rounded-full mt-1`}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < place.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {place.rating}.0
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>방문일: {place.date}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div
                className={`${
                  CATEGORY_COLORS[place.category]
                } w-5 h-5 rounded-full`}
              />
              <span>
                카테고리:{" "}
                {CATEGORY_NAMES[
                  place.category as keyof typeof CATEGORY_NAMES
                ] ?? "기타"}
              </span>
            </div>
          </div>

          {place.memo && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-gray-900 mb-2">메모</h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {place.memo}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            {/* 앱 내 지도 이동 */}
            <Button
              onClick={() => onViewLocation(place)}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
            >
              <Navigation className="w-4 h-4 mr-2" />
              지도에서 위치 보기
            </Button>

            {/* 카카오맵 길찾기 */}
            <a
              href={kakaoMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-lg border border-yellow-400 bg-yellow-400/90 px-4 py-3 text-sm font-medium text-black shadow-sm hover:bg-yellow-400"
            >
              <MapPin className="w-4 h-4 mr-2" />
              카카오맵 길찾기 열기
            </a>

            {/* 🔥 새로 추가: 공유 / 링크 복사 버튼 */}
            <Button
              type="button"
              variant="outline"
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              맛집 정보 복사하기
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <PlaceFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSubmit={onUpdate}
        initialPlace={place}
      />

      {/* Delete Dialog */}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>맛집 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 맛집을 삭제하시겠습니까? 이 작업은
              되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취��</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}