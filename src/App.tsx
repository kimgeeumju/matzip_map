// src/App.tsx
import { useState } from "react";
import { LoginPage } from "./pages/login";
import { SignupPage } from "./pages/signup";
import { MapPage } from "./pages/map";
import { FeedPage } from "./pages/feed";
import { CalendarPage } from "./pages/calendar";
import { MyPage } from "./pages/my-page";
import { PlaceDetailPage } from "./pages/place-detail";
import { PasswordVerifyPage } from "./pages/password-verify";
import { ProfileEditPage } from "./pages/profile-edit";
import { WishlistPage } from "./pages/wishlist";
import { WishlistSearchPage } from "./pages/wishlist-search";
import { CollectionDetailPage } from "./pages/collection-detail";
import { CollectionCreatePage } from "./pages/collection-create";
import { CollectionAddPlacesPage } from "./pages/collection-add-places";
import { MapSearchAddPage } from "./pages/map-search-add-page";
import { toast } from "sonner";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://matzipmapback-production.up.railway.app";

export type Place = {
  id: string;
  name: string;
  date: string;
  rating: number;
  category: "RED" | "YELLOW" | "GREEN" | "BLUE" | "PURPLE";
  photos: string[];
  lat: number;
  lng: number;
  isFavorite: boolean;
  isWishlist: boolean;
  memo?: string;
  address?: string;
};

export type UserProfile = {
  email: string;
  password: string;
  nickname: string;
  bio: string;
  followingCount: number;
  followerCount: number;
};

export type Collection = {
  id: string;
  name: string;
  description: string;
  placeIds: string[];
  createdAt: string;
};

// 🔐 유저별 places를 localStorage에 저장하기 위한 헬퍼들
const STORAGE_KEY_PREFIX = "matzip_places_";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getUserPlacesKey(email: string): string {
  return STORAGE_KEY_PREFIX + normalizeEmail(email);
}

function loadPlacesForUser(email: string): Place[] {
  try {
    const key = getUserPlacesKey(email);
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as Place[];
  } catch {
    return [];
  }
}

function savePlacesForUser(email: string, places: Place[]) {
  try {
    const key = getUserPlacesKey(email);
    localStorage.setItem(key, JSON.stringify(places));
  } catch {
    // 저장 실패해도 앱이 죽지 않도록 조용히 무시
  }
}

type Page =
  | "login"
  | "signup"
  | "map"
  | "map-search"
  | "feed"
  | "calendar"
  | "mypage"
  | "detail"
  | "password-verify"
  | "profile-edit"
  | "wishlist"
  | "wishlist-search"
  | "collection-detail"
  | "collection-create"
  | "collection-add-places";

export default function App() {
  // ✅ 앱이 처음 켜질 때 기본은 무조건 "login"
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [tempCollection, setTempCollection] =
    useState<Partial<Collection> | null>(null);

  // ✅ 이메일/비번 로그인
  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const msg = await res.text();
        console.error("signin error:", msg);
        toast.error("로그인에 실패했습니다. 이메일/비밀번호를 확인해주세요.");
        return;
      }

      const data = await res.json(); // { accessToken, refreshToken }
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      const normalizedEmail = normalizeEmail(email);
      const userPlaces = loadPlacesForUser(normalizedEmail);

      const newUser: UserProfile = {
        email: normalizedEmail,
        password,
        nickname: normalizedEmail.split("@")[0],
        bio: "취향 한 줄 소개가 여기에 표시됩니다",
        followingCount: 0,
        followerCount: 0,
      };

      setUser(newUser);
      setPlaces(userPlaces); // 🔥 이 계정이 전에 저장해둔 맛집 복구

      toast.success("로그인 성공!");
      setCurrentPage("map");
    } catch (err) {
      console.error(err);
      toast.error("로그인 중 서버 오류가 발생했습니다.");
    }
  };

  // ✅ 회원가입
  const handleSignup = async (
    email: string,
    password: string,
    name: string,
  ) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("signup error:", text);
        toast.error("회원가입에 실패했습니다. 이메일/비밀번호 형식을 확인해주세요.");
        return;
      }

      const normalizedEmail = normalizeEmail(email);
      const userPlaces = loadPlacesForUser(normalizedEmail); // 혹시 이미 저장된 게 있으면 불러오기

      const newUser: UserProfile = {
        email: normalizedEmail,
        password,
        nickname: name || normalizedEmail.split("@")[0],
        bio: "",
        followingCount: 0,
        followerCount: 0,
      };

      setUser(newUser);
      setPlaces(userPlaces);

      toast.success("회원가입 완료! 자동 로그인되었습니다.");
      setCurrentPage("map");
    } catch (err) {
      console.error(err);
      toast.error("회원가입 중 서버 오류가 발생했습니다.");
    }
  };

  const handleUpdateProfile = (nickname: string, bio: string) => {
    if (user) {
      setUser({ ...user, nickname, bio });
    }
    setCurrentPage("mypage");
  };

  // 🔥 맛집이 바뀔 때마다, 현재 로그인한 유저 계정으로 저장
  const syncPlaces = (updated: Place[]) => {
    setPlaces(updated);
    if (user) {
      savePlacesForUser(user.email, updated);
    }
  };

  const handleAddPlace = (place: Place) => {
    const updated = [...places, place];
    syncPlaces(updated);
  };

  const handleUpdatePlace = (updatedPlace: Place) => {
    const updated = places.map((p) => (p.id === updatedPlace.id ? updatedPlace : p));
    syncPlaces(updated);
    setSelectedPlace(null);
    setCurrentPage("feed");
  };

  const handleDeletePlace = (placeId: string) => {
    const updated = places.filter((p) => p.id !== placeId);
    syncPlaces(updated);
    setSelectedPlace(null);
    setCurrentPage("feed");
  };

  const handleViewDetail = (place: Place) => {
    setSelectedPlace(place);
    setCurrentPage("detail");
  };

  const handleTogglePlaceFavorite = (placeId: string) => {
    const updated = places.map((p) =>
      p.id === placeId ? { ...p, isFavorite: !p.isFavorite } : p,
    );
    syncPlaces(updated);
  };

  const handleTogglePlaceWishlist = (placeId: string) => {
    const updated = places.map((p) =>
      p.id === placeId ? { ...p, isWishlist: !p.isWishlist } : p,
    );
    syncPlaces(updated);
  };

  const handleAddWishlistPlace = (place: Place) => {
    const updated = [...places, { ...place, isWishlist: true }];
    syncPlaces(updated);
  };

  const handleCreateCollection = (name: string, description: string) => {
    const newCollection: Collection = {
      id: Date.now().toString(),
      name,
      description,
      placeIds: [],
      createdAt: new Date().toISOString(),
    };
    setTempCollection(newCollection);
    setCurrentPage("collection-add-places");
  };

  const handleAddPlacesToCollection = (placeIds: string[]) => {
    if (tempCollection && tempCollection.id) {
      const finalCollection: Collection = {
        ...tempCollection,
        placeIds,
      } as Collection;
      setCollections([...collections, finalCollection]);
      setTempCollection(null);
      setCurrentPage("mypage");
    }
  };

  const handleViewCollection = (collection: Collection) => {
    setSelectedCollection(collection);
    setCurrentPage("collection-detail");
  };

  const handleDeleteCollection = (collectionId: string) => {
    setCollections(collections.filter((c) => c.id !== collectionId));
    setCurrentPage("mypage");
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  // ---------------- 페이지 분기 ----------------

  if (currentPage === "login") {
    return (
      <LoginPage
        onLogin={handleLogin}
        onNavigateToSignup={() => setCurrentPage("signup")}
      />
    );
  }

  if (currentPage === "signup") {
    return (
      <SignupPage
        onSignup={handleSignup}
        onNavigateToLogin={() => setCurrentPage("login")}
      />
    );
  }

  if (currentPage === "password-verify") {
    return (
      <PasswordVerifyPage
        userPassword={user?.password || ""}
        onVerified={() => setCurrentPage("profile-edit")}
        onBack={() => setCurrentPage("mypage")}
      />
    );
  }

  if (currentPage === "profile-edit" && user) {
    return (
      <ProfileEditPage
        nickname={user.nickname}
        bio={user.bio}
        onSave={handleUpdateProfile}
        onBack={() => setCurrentPage("mypage")}
      />
    );
  }

  if (currentPage === "wishlist") {
    return (
      <WishlistPage
        places={places.filter((p) => p.isWishlist)}
        onAddWishlist={() => setCurrentPage("wishlist-search")}
        onViewDetail={handleViewDetail}
        onToggleWishlist={handleTogglePlaceWishlist}
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentPage === "wishlist-search") {
    return (
      <WishlistSearchPage
        onAddPlace={handleAddWishlistPlace}
        onBack={() => setCurrentPage("wishlist")}
      />
    );
  }

  if (currentPage === "collection-create") {
    return (
      <CollectionCreatePage
        onNext={handleCreateCollection}
        onBack={() => setCurrentPage("mypage")}
      />
    );
  }

  if (currentPage === "collection-add-places") {
    return (
      <CollectionAddPlacesPage
        places={places.filter((p) => !p.isWishlist)}
        onComplete={handleAddPlacesToCollection}
        onBack={() => setCurrentPage("mypage")}
      />
    );
  }

  if (currentPage === "collection-detail" && selectedCollection) {
    return (
      <CollectionDetailPage
        collection={selectedCollection}
        places={places.filter((p) =>
          selectedCollection.placeIds.includes(p.id),
        )}
        onViewDetail={handleViewDetail}
        onDelete={() => handleDeleteCollection(selectedCollection.id)}
        onBack={() => setCurrentPage("mypage")}
      />
    );
  }

  if (currentPage === "map-search") {
    return (
      <MapSearchAddPage
        onAddPlace={(place) => {
          handleAddPlace(place);
          setCurrentPage("map");
        }}
        onBack={() => setCurrentPage("map")}
      />
    );
  }

  if (currentPage === "map") {
    return (
      <MapPage
        places={places}
        onAddPlace={handleAddPlace}
        onViewDetail={handleViewDetail}
        onNavigate={handleNavigate}
        filterCategories={filterCategories}
        onFilterChange={setFilterCategories}
      />
    );
  }

  if (currentPage === "feed") {
    return (
      <FeedPage
        places={places}
        onViewDetail={handleViewDetail}
        onNavigate={handleNavigate}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={setShowFavoritesOnly}
        onTogglePlaceFavorite={handleTogglePlaceFavorite}
      />
    );
  }

  if (currentPage === "calendar") {
    return (
      <CalendarPage
        places={places}
        onViewDetail={handleViewDetail}
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentPage === "mypage" && user) {
    return (
      <MyPage
        user={user}
        places={places}
        collections={collections}
        onNavigate={handleNavigate}
        onViewCollection={handleViewCollection}
      />
    );
  }

  if (currentPage === "detail" && selectedPlace) {
    return (
      <PlaceDetailPage
        place={selectedPlace}
        onUpdate={handleUpdatePlace}
        onDelete={handleDeletePlace}
        onBack={() => setCurrentPage("feed")}
        onViewLocation={(place) => {
          setSelectedPlace(place);
          setCurrentPage("map");
        }}
      />
    );
  }

  return null;
}
