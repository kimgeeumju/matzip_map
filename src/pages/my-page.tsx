import { useState } from 'react';
import { UserPlus, Settings, Share2, User, Plus, ChevronRight } from 'lucide-react';
import type{ Place, UserProfile, Collection } from "../App";
import { BottomNav } from "../components/bottom-nav";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

type MyPageProps = {
  user: UserProfile;
  places: Place[];
  collections: Collection[];
  onNavigate: (
    page: "map" | "feed" | "calendar" | "mypage" | "password-verify" | "wishlist" | "collection-create" | "collection-detail",
  ) => void;
  onViewCollection: (collection: Collection) => void;
};

type MyPageTab = 'wishlist' | 'visited' | 'collection';

function ProfileHeader({ user }: { user: UserProfile }) {
  return (
    <div className="px-4 pt-4 pb-6">
      <div className="flex items-start gap-4 mb-4">
        {/* 프로필 이미지 */}
        <div className="w-20 h-20 rounded-full bg-[#E5E5EA] flex items-center justify-center flex-shrink-0">
          <User size={40} className="text-[#8E8E93]" />
        </div>
        
        {/* 닉네임 & 팔로우 정보 */}
        <div className="flex-1 pt-2">
          <div className="text-[#222222] mb-2">{user.nickname}</div>
          <div className="flex items-center gap-2 text-[#8E8E93] text-sm">
            <span>팔로워 {user.followerCount}</span>
            <span>|</span>
            <span>팔로잉 {user.followingCount}</span>
          </div>
        </div>
      </div>
      
      {/* 취향 소개 */}
      <div className="text-[#8E8E93] text-sm mb-4">
        {user.bio || "취향 한 줄 소개가 여기에 표시됩니다"}
      </div>
    </div>
  );
}

function ProfileActions({ 
  onEditProfile, 
  onShare 
}: { 
  onEditProfile: () => void;
  onShare: () => void;
}) {
  return (
    <div className="px-4 pb-4">
      <div className="flex gap-2">
        <button 
          onClick={onEditProfile}
          className="flex-1 py-2 px-4 bg-white border border-[#D1D1D6] rounded-lg text-[#222222] text-sm"
        >
          프로필 수정
        </button>
        <button 
          onClick={onShare}
          className="flex-1 py-2 px-4 bg-white border border-[#D1D1D6] rounded-lg text-[#222222] text-sm flex items-center justify-center gap-2"
        >
          <Share2 size={16} />
          <span>공유</span>
        </button>
      </div>
    </div>
  );
}

interface StatsSectionProps {
  places: Place[];
}

function StatsSection({ places }: StatsSectionProps) {
  const visitedPlaces = places.filter(p => !p.isWishlist);
  
  // 가장 많이 방문한 카테고리 찾기
  const categoryCount: Record<string, number> = {};
  visitedPlaces.forEach(p => {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
  });
  
  const categoryLabels: Record<string, string> = {
    RED: "한식",
    YELLOW: "양식",
    GREEN: "중식",
    BLUE: "일식",
    PURPLE: "기타"
  };
  
  const sortedCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => categoryLabels[cat]);
  
  const preferredStyle = sortedCategories.length > 0 
    ? sortedCategories.slice(0, 2).join(' · ')
    : "기록 없음";
  
  // 평균 평점 계산
  const avgRating = visitedPlaces.length > 0
    ? (visitedPlaces.reduce((sum, p) => sum + p.rating, 0) / visitedPlaces.length).toFixed(1)
    : "0.0";

  return (
    <div className="border-t border-[#E5E5EA] px-4 py-4">
      <div className="flex items-center gap-6">
        <div>
          <div className="text-[#8E8E93] text-xs mb-1">선호 스타일</div>
          <div className="text-[#222222]">{preferredStyle}</div>
        </div>
        <div>
          <div className="text-[#8E8E93] text-xs mb-1">평균 평점</div>
          <div className="text-[#222222]">{avgRating}점</div>
        </div>
      </div>
    </div>
  );
}

interface ArchiveTabsProps {
  selectedTab: MyPageTab;
  onTabChange: (tab: MyPageTab) => void;
}

function ArchiveTabs({ selectedTab, onTabChange }: ArchiveTabsProps) {
  const tabs: { id: MyPageTab; label: string }[] = [
    { id: 'wishlist', label: '가고 싶은 맛집' },
    { id: 'visited', label: '이미 다녀온 맛집' },
    { id: 'collection', label: '내 컬렉션' },
  ];

  return (
    <div className="border-b border-[#E5E5EA]">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 py-3 relative"
          >
            <span
              className={`text-sm ${
                selectedTab === tab.id
                  ? 'text-[#222222]'
                  : 'text-[#8E8E93]'
              }`}
            >
              {tab.label}
            </span>
            {selectedTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF2D55]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

interface ArchiveSectionProps {
  selectedTab: MyPageTab;
  onTabChange: (tab: MyPageTab) => void;
  places: Place[];
  collections: Collection[];
  onNavigateWishlist: () => void;
  onNavigateCollectionCreate: () => void;
  onViewCollection: (collection: Collection) => void;
}

function ArchiveSection({ 
  selectedTab, 
  onTabChange, 
  places, 
  collections,
  onNavigateWishlist,
  onNavigateCollectionCreate,
  onViewCollection,
}: ArchiveSectionProps) {
  const visitedPlaces = places.filter(p => !p.isWishlist);
  const wishlistPlaces = places.filter(p => p.isWishlist);

  return (
    <div className="border-t border-[#E5E5EA]">
      {/* 보관함 헤더 */}
      <div className="px-4 py-3 flex items-center justify-between">
        <span className="text-[#222222]">보관함</span>
      </div>
      
      {/* 탭 바 */}
      <ArchiveTabs selectedTab={selectedTab} onTabChange={onTabChange} />
      
      {/* 탭 컨텐츠 영역 */}
      <div className="px-4 py-6">
        {selectedTab === 'wishlist' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#8E8E93]">
                {wishlistPlaces.length}곳
              </span>
              <button
                onClick={onNavigateWishlist}
                className="text-sm text-[#FF2D55] flex items-center gap-1"
              >
                전체 보기
                <ChevronRight size={16} />
              </button>
            </div>
            {wishlistPlaces.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#8E8E93] mb-4">가고 싶은 맛집이 없습니다</p>
                <Button
                  onClick={onNavigateWishlist}
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-red-500"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  맛집 추가하기
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {wishlistPlaces.slice(0, 3).map((place) => (
                  <div key={place.id} className="text-left bg-gray-50 p-3 rounded-lg">
                    <div className="text-[#222222] mb-1">{place.name}</div>
                    {place.address && (
                      <div className="text-xs text-[#8E8E93]">{place.address}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {selectedTab === 'visited' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#8E8E93]">
                {visitedPlaces.length}곳
              </span>
            </div>
            {visitedPlaces.length === 0 ? (
              <div className="text-center text-[#8E8E93] py-8">
                다녀온 맛집이 없습니다
              </div>
            ) : (
              <div className="space-y-2">
                {visitedPlaces.slice(0, 3).map((place) => (
                  <div key={place.id} className="text-left bg-gray-50 p-3 rounded-lg">
                    <div className="text-[#222222] mb-1">{place.name}</div>
                    <div className="text-xs text-[#8E8E93]">
                      {place.date} · ⭐ {place.rating}
                    </div>
                  </div>
                ))}
                {visitedPlaces.length > 3 && (
                  <div className="text-xs text-[#8E8E93] text-center mt-2">
                    외 {visitedPlaces.length - 3}곳 더 있어요
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {selectedTab === 'collection' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#8E8E93]">
                {collections.length}개
              </span>
              <button
                onClick={onNavigateCollectionCreate}
                className="text-sm text-[#FF2D55] flex items-center gap-1"
              >
                <Plus size={16} />
                컬렉션 추가
              </button>
            </div>
            {collections.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#8E8E93] mb-4">컬렉션이 없습니다</p>
                <Button
                  onClick={onNavigateCollectionCreate}
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-red-500"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  컬렉션 만들기
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {collections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => onViewCollection(collection)}
                    className="w-full text-left bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-[#222222] mb-1">{collection.name}</div>
                    <div className="text-xs text-[#8E8E93]">
                      {collection.placeIds.length}곳 · {new Date(collection.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function MyPage({ user, places, collections, onNavigate, onViewCollection }: MyPageProps) {
  const [selectedTab, setSelectedTab] = useState<MyPageTab>('visited');

  const handleShare = async () => {
    const visitedPlaces = places.filter(p => !p.isWishlist);
    
    // 카테고리 선호도 계산
    const categoryCount: Record<string, number> = {};
    visitedPlaces.forEach(p => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
    });
    const categoryLabels: Record<string, string> = {
      RED: "한식", YELLOW: "양식", GREEN: "중식", BLUE: "일식", PURPLE: "기타"
    };
    const sortedCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => categoryLabels[cat]);
    const preferredStyle = sortedCategories.slice(0, 2).join(', ');
    
    // 평균 평점 계산
    const avgRating = visitedPlaces.length > 0
      ? (visitedPlaces.reduce((sum, p) => sum + p.rating, 0) / visitedPlaces.length).toFixed(1)
      : "0.0";

    const introText = user.bio && user.bio.trim().length > 0
      ? user.bio.trim()
      : "아직 한줄 소개를 작성하지 않았어요";

    const shareText = `🍽️ 내 맛집 취향 카드

• 취향 한줄 소개: ${introText}
• 선호 스타일: ${preferredStyle || "아직 선택하지 않았어요"}
• 평균 평점: ${avgRating}점
• 방문한 맛집 수: ${visitedPlaces.length}곳

같이 맛집 탐방 가요 🙂 
(앱에서 자동 생성된 취향 카드)`;

    // 텍스트만 클립보드에 복사 (공유 다이얼로그 없이)
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("취향 카드가 클립보드에 복사됐어요!");
    } catch (error) {
      toast.error("복사에 실패했어요");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto">
        {/* 상단 앱바 */}
        <div className="px-4 py-3 flex items-center justify-end gap-4 border-b border-[#E5E5EA]">
          <button className="text-[#222222]">
            <UserPlus size={24} />
          </button>
          <button className="text-[#222222]">
            <Settings size={24} />
          </button>
        </div>
        
        {/* 프로필 영역 */}
        <ProfileHeader user={user} />
        
        {/* 프로필 버튼 영역 */}
        <ProfileActions 
          onEditProfile={() => onNavigate("password-verify")}
          onShare={handleShare}
        />
        
        {/* 통계 영역 */}
        <StatsSection places={places} />
        
        {/* 보관함 섹션 */}
        <ArchiveSection 
          selectedTab={selectedTab} 
          onTabChange={setSelectedTab}
          places={places}
          collections={collections}
          onNavigateWishlist={() => onNavigate("wishlist")}
          onNavigateCollectionCreate={() => onNavigate("collection-create")}
          onViewCollection={onViewCollection}
        />
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav currentPage="mypage" onNavigate={onNavigate} />
    </div>
  );
}
