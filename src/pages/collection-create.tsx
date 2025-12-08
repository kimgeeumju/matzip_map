import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { ArrowLeft, FolderPlus } from "lucide-react";

type CollectionCreatePageProps = {
  onNext: (name: string, description: string) => void;
  onBack: () => void;
};

export function CollectionCreatePage({ onNext, onBack }: CollectionCreatePageProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNext(name, description);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
        <button onClick={onBack} className="text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h1>컬렉션 만들기</h1>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-6 mx-auto">
          <FolderPlus className="w-8 h-8 text-pink-500" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">컬렉션 이름</Label>
            <Input
              id="name"
              type="text"
              placeholder="예: 데이트 코스, 혼밥 맛집"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={30}
            />
            <p className="text-xs text-gray-500">{name.length}/30</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">컬렉션 소개</Label>
            <Textarea
              id="description"
              placeholder="이 컬렉션에 대해 간단히 설명해주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={100}
            />
            <p className="text-xs text-gray-500">{description.length}/100</p>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
          >
            다음 (맛집 선택하기)
          </Button>
        </form>
      </div>
    </div>
  );
}
