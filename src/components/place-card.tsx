import type { Place } from "../App";
import { Heart, Star, Calendar } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type PlaceCardProps = {
  place: Place;
  onViewDetail: () => void;
  onToggleFavorite: () => void;
};

const CATEGORY_COLORS = {
  RED: "bg-red-500",
  YELLOW: "bg-yellow-500",
  GREEN: "bg-green-500",
  BLUE: "bg-blue-500",
  PURPLE: "bg-purple-500",
};

export function PlaceCard({ place, onViewDetail, onToggleFavorite }: PlaceCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative aspect-[4/3]">
        {place.photos.length > 0 ? (
          <ImageWithFallback
            src={place.photos[0]}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center">
            <span className="text-gray-400 text-4xl">🍽️</span>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md"
        >
          <Heart
            className={`w-5 h-5 ${
              place.isFavorite ? "fill-pink-500 text-pink-500" : "text-gray-400"
            }`}
          />
        </button>
        <div
          className={`absolute top-3 left-3 ${
            CATEGORY_COLORS[place.category]
          } w-3 h-3 rounded-full shadow-md`}
        />
      </div>

      {/* Content */}
      <div onClick={onViewDetail} className="p-4 cursor-pointer">
        <h3 className="text-gray-900 mb-2">{place.name}</h3>
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < place.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span>{place.rating}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{place.date}</span>
        </div>
        {place.memo && (
          <p className="text-gray-600 mt-2 line-clamp-2">{place.memo}</p>
        )}
      </div>
    </div>
  );
}