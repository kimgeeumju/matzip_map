import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { ArrowLeft } from "lucide-react";

type ProfileEditPageProps = {
  nickname: string;
  bio: string;
  onSave: (nickname: string, bio: string) => void;
  onBack: () => void;
};

export function ProfileEditPage({
  nickname,
  bio,
  onSave,
  onBack,
}: ProfileEditPageProps) {
  const [newNickname, setNewNickname] = useState(nickname);
  const [newBio, setNewBio] = useState(bio);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(newNickname, newBio);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <button onClick={onBack} className="text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h1>프로필 수정</h1>
        <div className="w-6" />
      </div>

      {/* Content */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              type="text"
              placeholder="닉네임을 입력하세요"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              required
              maxLength={20}
            />
            <p className="text-xs text-gray-500">
              {newNickname.length}/20
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">한 줄 소개</Label>
            <Textarea
              id="bio"
              placeholder="자신을 소개해보세요"
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              rows={3}
              maxLength={100}
            />
            <p className="text-xs text-gray-500">
              {newBio.length}/100
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
          >
            저장
          </Button>
        </form>
      </div>
    </div>
  );
}
