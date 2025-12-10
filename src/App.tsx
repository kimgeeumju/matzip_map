// src/App.tsx
import { useEffect, useState } from "react";
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

const API_BASE_URL = import.meta.env.VITE_API_URL;

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

// 🔐 유저별 + 전역 places 를 localStorage에 저장하기 위한 헬퍼들
const STORAGE_KEY_PREFIX = "matzip_places_";
const GLOBAL_STORAGE_KEY = "matzip_places_global";
const LAST_USER_EMAIL_KEY = "matzip_last_user_email";

function loadPlacesForUser(email: string): Place[] {
  try {
    const key = STORAGE_KEY_PREFIX + email;
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as Place[];
  } catch {
    return [];
  }
}

function savePlacesForUser(email: string, places: Place[]) {
  try {
    const key = STORAGE_KEY_PREFIX + email;
    localStorage.setItem(key, JSON.stringify(places));
  } catch {
    // 무시
  }
}

function loadGlobalPlaces(): Place[] {
  try {
    const raw = localStorage.getItem(GLOBAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Place[];
  } catch {
    return [];
  }
}

function saveGlobalPlaces(places: Place[]) {
  try {
    localStorage.setItem(GLOBAL_STORAGE_KEY, JSON.stringify(places));
  } catch {
    // 무시
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

  // ✅ 앱 처음 켜질 때: 마지막 로그인한 유저 / 저장된 맛집 자동 복원
  useEffect(() => {
    try {
      const lastEmail = localStorage.getItem(LAST_USER_EMAIL_KEY);
      const accessToken = localStorage.getItem("accessToken");

      const globalPlaces = loadGlobalPlaces();

      if (lastEmail && accessToken) {
        const normalizedEmail = lastEmail.trim().toLowerCase();
        const userPlaces = loadPlacesForUser(normalizedEmail);

        const finalPlaces =
          userPlaces.length > 0
            ? userPlaces
            : globalPlaces.length > 0
            ? globalPlaces
            : [];

        // 유저 정보도 자동으로 세팅해서 바로 map 페이지로
        const autoUser: UserProfile = {
          email: normalizedEmail,
          password: "", // 실제 비밀번호는 몰라도 됨 (다시 로그인 시 입력)
          nickname: normalizedEmail.split("@")[0],
          bio: "취향 한 줄 소개가 여기에 표시됩니다",
          followingCount: 0,
          followerCount: 0,
        };

        setUser(autoUser);
        setPlaces(finalPlaces);
        setCurrentPage("map"); // 🔥 바로 지도 페이지로
      } else {
        // 로그인 정보는 없지만, 전역 places 는 있을 수 있음
        if (globalPlaces.length > 0) {
          setPlaces(globalPlaces);
        }
        setCurrentPage("login");
      }
    } catch (e) {
      console.error("초기 로드 에러:", e);
      setCurrentPage("login");
    }
  }, []);

  // ✅ 실제 백엔드 /auth/signin 호출
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

      const normalizedEmail = email.trim().toLowerCase();
      localStorage.setItem(LAST_USER_EMAIL_KEY, normalizedEmail);

      const userPlaces = loadPlacesForUser(normalizedEmail);
      const globalPlaces = loadGlobalPlaces();

      const finalPlaces =
        userPlaces.length > 0
          ? userPlaces
          : globalPlaces.length > 0
          ? globalPlaces
          : [];

      savePlacesForUser(normalizedEmail, finalPlaces);
      saveGlobalPlaces(finalPlaces);

      const newUser: UserProfile = {
        email: normalizedEmail,
        password,
        nickname: normalizedEmail.split("@")[0],
        bio: "취향 한 줄 소개가 여기에 표시됩니다",
        followingCount: 0,
        followerCount: 0,
      };

      setUser(newUser);
      setPlaces(finalPlaces);

      toast.success("로그인 성공!");
      setCurrentPage("map");
    } catch (err) {
      console.error(err);
      toast.error("로그인 중 서버 오류가 발생했습니다.");
    }
  };

  // ✅ 실제 백엔드 /auth/signup 호출
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

      const normalizedEmail = email.trim().toLowerCase();
      localStorage.setItem(LAST_USER_EMAIL_KEY, normalizedEmail);

      const userPlaces = loadPlacesForUser(normalizedEmail);
      const globalPlaces = loadGlobalPlaces();
      const finalPlaces =
        userPlaces.length > 0
          ? userPlaces
          : globalPlaces.length > 0
          ? globalPlaces
          : [];

      savePlacesForUser(normalizedEmail, finalPlaces);
      saveGlobalPlaces(finalPlaces);

      const newUser: UserProfile = {
        email: normalizedEmail,
        password,
        nickname: name || normalizedEmail.split("@")[0],
        bio: "",
        followingCount: 0,
        followerCount: 0,
      };

      setUser(newUser);
      setPlaces(finalPlaces);

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

  // ✅ 맛집 추가 시 localStorage(전역 + 유저별)에 저장
  const handleAddPlace = (place: Place) => {
    setPlaces((prev) => {
      const updated = [...prev, place];

      saveGlobalPlaces(updated);
      if (user) {
        savePlacesForUser(user.email, updated);
      }

      return updated;
    });
  };

  const handleUpdatePlace = (updatedPlace: Place) => {
    setPlaces((prev) => {
      const updated = prev.map((p) => (p.id === updatedPlace.id ? updatedPlace : p));

      saveGlobalPlaces(updated);
      if (user) {
        savePlacesForUser(user.email, updated);
      }

      return updated;
    });
    setSelectedPlace(null);
    setCurrentPage("feed");
  };

  const handleDeletePlace = (placeId: string) => {
    setPlaces((prev) => {
      const updated = prev.filter((p) => p.id !== placeId);

      saveGlobalPlaces(updated);
      if (user) {
        savePlacesForUser(user.email, updated);
      }

      return updated;
    });
    setSelectedPlace(null);
    setCurrentPage("feed");
  };

  const handleViewDetail = (place: Place) => {
    setSelectedPlace(place);
    setCurrentPage("detail");
  };

  const handleTogglePlaceFavorite = (placeId: string) => {
    setPlaces((prev) => {
      const updated = prev.map((p) =>
        p.id === placeId ? { ...p, isFavorite: !p.isFavorite } : p,
      );

      saveGlobalPlaces(updated);
      if (user) {
        savePlacesForUser(user.email, updated);
      }

      return updated;
    });
  };

  const handleTogglePlaceWishlist = (placeId: string) => {
    setPlaces((prev) => {
      const updated = prev.map((p) =>
        p.id === placeId ? { ...p, isWishlist: !p.isWishlist } : p,
      );

      saveGlobalPlaces(updated);
      if (user) {
        savePlacesForUser(user.email, updated);
      }

      return updated;
    });
  };

  const handleAddWishlistPlace = (place: Place) => {
    setPlaces((prev) => {
      const updated = [...prev, { ...place, isWishlist: true }];

      saveGlobalPlaces(updated);
      if (user) {
        savePlacesForUser(user.email, updated);
      }

      return updated;
    });
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
