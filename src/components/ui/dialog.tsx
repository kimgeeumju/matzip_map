"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "./utils";

// 루트
export function Dialog(
  props: React.ComponentProps<typeof DialogPrimitive.Root>,
) {
  return <DialogPrimitive.Root {...props} />;
}

// 트리거 버튼
export function DialogTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>,
) {
  return <DialogPrimitive.Trigger {...props} />;
}

// 포털
export function DialogPortal(
  props: React.ComponentProps<typeof DialogPrimitive.Portal>,
) {
  return <DialogPrimitive.Portal {...props} />;
}

// 배경 오버레이
export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DialogOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        // 화면 전체 덮는 반투명 배경
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out",
        className,
      )}
      {...props}
    />
  );
});

// ✨ 여기서 “정중앙 정렬” 강제
export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(function DialogContent({ className, children, ...props }, ref) {
  return (
    <DialogPortal>
      <DialogOverlay />
      {/* 화면 전체를 flex 컨테이너로 만들어 중앙 정렬 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            // 팝업 박스 스타일
            "w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border bg-background p-6 shadow-lg outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            className,
          )}
          {...props}
        >
          {children}
          {/* 닫기 버튼 */}
          <DialogPrimitive.Close
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background/80 text-muted-foreground hover:bg-muted"
          >
            <XIcon className="w-4 h-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </div>
    </DialogPortal>
  );
});

// 헤더 영역
export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1.5 text-left", className)} {...props} />
  );
}

// 제목
export const DialogTitle = React.forwardRef<
  React.ElementRef<"h2">,
  React.ComponentPropsWithoutRef<"h2">
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <h2
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
});

// 설명 텍스트
export const DialogDescription = React.forwardRef<
  React.ElementRef<"p">,
  React.ComponentPropsWithoutRef<"p">
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

// (혹시 나중에 쓸 수도 있으니 같이 export)
export const DialogClose = DialogPrimitive.Close;
export const DialogFooter = function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-4 flex flex-col-reverse gap-2 sm:mt-6 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
};
