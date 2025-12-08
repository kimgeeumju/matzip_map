import { useState, useEffect } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import type { Place } from "../App";
import { Calendar, Star, Image as ImageIcon } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type PlaceFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (place: Place) => void;
  initialLocation?: {
    lat: number;
    lng: number;
    name?: string;
    address?: string;
  } | null;
  initialPlace?: Place;
};

// 점수 라벨 대신 카테고리 라벨
const CATEGORIES = [
  { value: "RED", label: "한식", color: "bg-red-500" },
  { value: "YELLOW", label: "양식", color: "bg-yellow-500" },
  { value: "GREEN", label: "중식", color: "bg-green-500" },
  { value: "BLUE", label: "일식", color: "bg-blue-500" },
  { value: "PURPLE", label: "기타", color: "bg-purple-500" },
] as const;

type CategoryValue = (typeof CATEGORIES)[number]["value"];

export function PlaceFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialLocation,
  initialPlace,
}: PlaceFormDialogProps) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [rating, setRating] = useState(5);
  const [category, setCategory] =
    useState<CategoryValue>("RED");
  const [memo, setMemo] = useState("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (initialPlace) {
      // 수정 모드
      setName(initialPlace.name);
      setDate(initialPlace.date);
      setRating(initialPlace.rating);
      setCategory(initialPlace.category as CategoryValue);
      setMemo(initialPlace.memo || "");
      setImages(initialPlace.photos || []);
    } else {
      // 새로 추가 모드 + 지도에서 클릭한 위치 정보 사용
      setName(initialLocation?.name || "");
      setDate(new Date().toISOString().split("T")[0]);
      setRating(5);
      setCategory("RED");
      setMemo("");
      setImages([]);
    }
  }, [initialPlace, initialLocation, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const place: Place = {
      id: initialPlace?.id || Date.now().toString(),
      name,
      date,
      rating,
      category,
      lat:
        initialPlace?.lat ||
        initialLocation?.lat ||
        37.5665,
      lng:
        initialPlace?.lng ||
        initialLocation?.lng ||
        126.978,
      photos: images,
      memo,
      isFavorite: initialPlace?.isFavorite || false,
      isWishlist: initialPlace?.isWishlist || false,
      address:
        initialPlace?.address || initialLocation?.address,
    };

    onSubmit(place);
    onOpenChange(false);
  };

  // 파일 업로드 (선택사항)
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const urls = fileArray.map((file) =>
      URL.createObjectURL(file),
    );

    setImages((prev) => {
      const next = [...prev, ...urls];
      return next.slice(0, 6);
    });

    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const selectedCategory = CATEGORIES.find(
    (c) => c.value === category,
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-background p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle>
            {initialPlace ? "맛집 수정" : "맛집 등록"}
          </DialogTitle>
          <DialogDescription>
            {initialPlace
              ? "맛집 정보를 수정하세요."
              : "새로운 맛집을 등록하세요."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="mt-4 space-y-6"
        >
          {/* 이름 */}
          <div className="space-y-2">
            <Label htmlFor="name">음식점 이름 *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="맛집 이름을 입력하세요"
              required
            />
          </div>

          {/* 방문 날짜 */}
          <div className="space-y-2">
            <Label htmlFor="date">방문 날짜 *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* 평점 */}
          <div className="space-y-2">
            <Label>평점 *</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              현재 선택한 평점:{" "}
              <span className="font-medium">{rating}점</span>
            </p>
          </div>

          {/* 카테고리 선택 */}
          <div className="space-y-2">
            <Label>카테고리 *</Label>
            <p className="text-xs text-gray-400">
              한식 / 양식 / 중식 / 일식 / 기타 중 하나를
              선택하세요.
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isActive =
                  cat.value === category;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() =>
                      setCategory(cat.value)
                    }
                    className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 transition-all ${
                      isActive
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full ${cat.color}`}
                    />
                    <span className="text-sm">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {selectedCategory && (
              <p className="text-sm text-gray-500">
                선택한 카테고리:{" "}
                <span className="font-medium">
                  {selectedCategory.label}
                </span>
              </p>
            )}
          </div>

          {/* 메모 */}
          <div className="space-y-2">
            <Label htmlFor="memo">메모</Label>
            <Textarea
              id="memo"
              value={memo}
              onChange={(e) =>
                setMemo(e.target.value)
              }
              placeholder="맛집에 대한 메모를 작성하세요"
              rows={3}
            />
          </div>

          {/* 사진 */}
          <div className="space-y-2">
            <Label>사진</Label>

            <input
              id="place-images"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="grid grid-cols-3 gap-2">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-square"
                >
                  <ImageWithFallback
                    src={img}
                    alt={`Place ${index + 1}`}
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveImage(index)
                    }
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}

              {images.length < 6 && (
                <label
                  htmlFor="place-images"
                  className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-pink-500 hover:bg-pink-50"
                >
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </label>
              )}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-12 flex-1 border-gray-200 hover:bg-gray-50"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="h-12 flex-1 bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg hover:from-pink-600 hover:to-rose-600"
            >
              {initialPlace ? "수정" : "등록"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
