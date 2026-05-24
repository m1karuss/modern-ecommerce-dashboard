import { useState, useEffect } from 'react';

type PlaceholderType = 'product' | 'avatar' | 'image' | 'no-image' | 'logo';

interface UsePlaceholderOptions {
  src?: string | null;
  fallback?: PlaceholderType;
}

export const usePlaceholder = ({ src, fallback = 'product' }: UsePlaceholderOptions) => {
  const [imageSrc, setImageSrc] = useState<string>(
    src || `/placeholders/${fallback}.svg`
  );
  const [isLoading, setIsLoading] = useState(!!src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setImageSrc(`/placeholders/${fallback}.svg`);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setImageSrc('/placeholders/no-image.svg');
      setIsLoading(false);
      setHasError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallback]);

  return { imageSrc, isLoading, hasError };
};

export default usePlaceholder;
