"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * LazyImage コンポーネント
 *
 * 画像の遅延読み込みとプレースホルダーを実装
 * 要件 10.2: 画像の遅延読み込みとプレースホルダーを使用
 */

interface LazyImageProps extends Omit<ImageProps, "onLoad"> {
  placeholderClassName?: string;
  onLoadComplete?: () => void;
}

export function LazyImage({
  src,
  alt,
  className,
  placeholderClassName,
  onLoadComplete,
  ...props
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoadComplete?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className,
        )}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div
          className={cn(
            "absolute inset-0 animate-pulse bg-muted",
            placeholderClassName,
          )}
        />
      )}
      <Image
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className,
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        {...props}
      />
    </div>
  );
}
