import { useState, ImgHTMLAttributes } from 'react';

type PlaceholderType = 'product' | 'avatar' | 'image' | 'no-image' | 'logo';

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallback?: PlaceholderType;
  alt: string;
}

export const ImageWithFallback = ({
  src,
  fallback = 'product',
  alt,
  className,
  ...props
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src || `/placeholders/${fallback}.svg`);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc('/placeholders/no-image.svg');
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      {...props}
    />
  );
};

export default ImageWithFallback;
