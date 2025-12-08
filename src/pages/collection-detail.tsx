import type { Place, Collection } from "../App";
import { Button } from "../components/ui/button";
import { ArrowLeft, Star, MapPin, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";

type CollectionDetailPageProps = {
  collection: Collection;
  places: Place[];
  onViewDetail: (place: Place) => void;
  onDelete: () => void;
  onBack: () => void;
};

export function CollectionDetailPage({
  collection,
  places,
  onViewDetail,
  onDelete,
  onBack,
}: CollectionDetailPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-900">
            <ArrowLeft size={24} />
          </button>
          <h1>컬렉션</h1>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-red-500">
              <Trash2 size={20} />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>컬렉션을 삭제하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                이 작업은 되돌릴 수 없습니다. 컬렉션이 영구적으로 삭제됩니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Collection Info */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-gray-900 mb-2">{collection.name}</h2>
        {collection.description && (
          <p className="text-gray-600 mb-4">{collection.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{places.length}곳</span>
          <span>
            {new Date(collection.createdAt).toLocaleDateString("ko-KR")}
          </span>
        </div>
      </div>

      {/* Places */}
      <div className="p-4">
        {places.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            컬렉션에 맛집이 없습니다
          </div>
        ) : (
          <div className="space-y-3">
            {places.map((place) => (
              <div
                key={place.id}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  {place.photos && place.photos.length > 0 && (
                    <img
                      src={place.photos[0]}
                      alt={place.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{place.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {place.rating}
                      </span>
                      <span>{place.date}</span>
                    </div>
                    {place.memo && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {place.memo}
                      </p>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetail(place)}
                    >
                      상세보기
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
