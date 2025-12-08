import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, Lock } from "lucide-react";

type PasswordVerifyPageProps = {
  userPassword: string;
  onVerified: () => void;
  onBack: () => void;
};

export function PasswordVerifyPage({
  userPassword,
  onVerified,
  onBack,
}: PasswordVerifyPageProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === userPassword) {
      onVerified();
    } else {
      setError("비밀번호가 일치하지 않습니다");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center">
        <button onClick={onBack} className="text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h1 className="ml-4">비밀번호 재확인</h1>
      </div>

      {/* Content */}
      <div className="p-6 max-w-md mx-auto">
        <div className="flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-6 mx-auto">
          <Lock className="w-8 h-8 text-pink-500" />
        </div>

        <h2 className="text-center text-gray-900 mb-2">
          본인 확인을 위해
        </h2>
        <p className="text-center text-gray-600 mb-8">
          비밀번호를 다시 한 번 입력해주세요
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
          >
            확인
          </Button>
        </form>
      </div>
    </div>
  );
}
