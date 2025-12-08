import { useEffect, useRef } from "react";
import type { Place } from "../App";

declare global {
  interface Window {
    kakao: any;
  }
}

type MapContainerProps = {
  places: Place[];
  onMapClick: (location: {
    lat: number;
    lng: number;
    name?: string;
    address?: string;
  }) => void;
  onMarkerClick: (place: Place) => void;
  searchQuery?: string;
};

export function MapContainer({
  places,
  onMapClick,
  onMarkerClick,
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // 🟡 카테고리 + 위시리스트 여부에 따라 마커 SVG 생성
  const getMarkerImage = (category?: string, isWishlist?: boolean) => {
    if (!window.kakao) return undefined;

    let color = "#f97316"; // 기본 오렌지
    if (category === "RED") color = "#ef4444"; // 한식
    if (category === "YELLOW") color = "#eab308"; // 양식
    if (category === "GREEN") color = "#22c55e"; // 중식
    if (category === "BLUE") color = "#3b82f6"; // 일식
    if (category === "PURPLE") color = "#a855f7"; // 기타

    const innerShape = isWishlist
      ? `
        <path
          d="M20 11 L22.4 16.1 L28 16.9 L23.8 20.8 L24.9 26.3 L20 23.4 L15.1 26.3 L16.2 20.8 L12 16.9 L17.6 16.1 Z"
          fill="white"
        />
      `
      : `
        <circle cx="20" cy="20" r="5" fill="white" />
      `;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <circle cx="20" cy="20" r="12" fill="${color}" />
        ${innerShape}
      </svg>
    `;

    const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      svg,
    )}`;

    const size = new window.kakao.maps.Size(40, 40);
    const options = {
      offset: new window.kakao.maps.Point(20, 40),
    };

    return new window.kakao.maps.MarkerImage(src, size, options);
  };

  // 🗺️ 지도 초기화 + 클릭 시 주변 음식점 이름/주소 가져오기
  useEffect(() => {
    if (!mapRef.current) return;
    if (!window.kakao || !window.kakao.maps) return;
    if (mapInstanceRef.current) return;

    const kakao = window.kakao;

    const centerLat =
      places[0]?.lat !== undefined ? places[0].lat : 37.5665;
    const centerLng =
      places[0]?.lng !== undefined ? places[0].lng : 126.978;

    const options = {
      center: new kakao.maps.LatLng(centerLat, centerLng),
      level: 5,
    };

    const map = new kakao.maps.Map(mapRef.current, options);
    mapInstanceRef.current = map;

    // 🔍 Places 서비스 생성 (음식점 카테고리 검색용)
    const placesService = new kakao.maps.services.Places();

    // 지도 클릭 시: 좌표 + 주변 음식점 이름/주소 조회
    kakao.maps.event.addListener(map, "click", (mouseEvent: any) => {
      const latlng = mouseEvent.latLng;
      const lat = latlng.getLat();
      const lng = latlng.getLng();
      const coord = new kakao.maps.LatLng(lat, lng);

      const callback = (data: any, status: string) => {
        if (status === kakao.maps.services.Status.OK && data.length > 0) {
          const nearest = data[0]; // 가장 가까운 음식점 하나
          onMapClick({
            lat,
            lng,
            name: nearest.place_name,
            address:
              nearest.address_name ||
              nearest.road_address_name ||
              "",
          });
        } else {
          // 주변에 음식점 없으면 좌표만 넘김
          onMapClick({ lat, lng });
        }
      };

      // FD6 = 음식점 카테고리, radius 단위: 미터
      const options = {
        location: coord,
        radius: 50,
      };

      placesService.categorySearch("FD6", callback, options);
    });

    const handleResize = () => {
      map.relayout();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [places, onMapClick]);

  // 📍 마커 렌더링
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (!window.kakao || !window.kakao.maps) return;

    const kakao = window.kakao;
    const map = mapInstanceRef.current;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    if (places.length === 0) return;

    const bounds = new kakao.maps.LatLngBounds();

    places.forEach((place) => {
      const position = new kakao.maps.LatLng(place.lat, place.lng);
      bounds.extend(position);

      const markerImage = getMarkerImage(
        (place as any).category,
        (place as any).isWishlist,
      );

      const marker = new kakao.maps.Marker({
        position,
        map,
        image: markerImage,
      });

      kakao.maps.event.addListener(marker, "click", () => {
        onMarkerClick(place);
      });

      markersRef.current.push(marker);
    });

    if (places.length === 1) {
      map.setCenter(
        new kakao.maps.LatLng(places[0].lat, places[0].lng),
      );
      map.setLevel(4);
    } else {
      map.setBounds(bounds);
    }
  }, [places, onMarkerClick]);

  return (
    <div className="h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}
