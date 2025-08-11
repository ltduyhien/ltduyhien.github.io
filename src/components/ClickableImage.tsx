import React, { useState } from 'react';

import { useMediaQuery } from '../hooks/useMediaQuery';

import Lightbox from './Lightbox';

interface ClickableImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  isProjectThumbnail?: boolean;
  onOpenLightbox?: () => void;
  onCloseLightbox?: () => void;
  caption?: string;
}

const ClickableImage: React.FC<ClickableImageProps> = ({
  src,
  alt,
  className = '',
  style,
  isProjectThumbnail = false,
  onOpenLightbox,
  onCloseLightbox,
  caption,
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleImageClick = () => {
    if (isDesktop && !isProjectThumbnail) {
      setIsLightboxOpen(true);
      onOpenLightbox?.();
    }
  };

  const handleLightboxClose = () => {
    setIsLightboxOpen(false);
    onCloseLightbox?.();
  };

  // Handle submodule image paths
  const imageSrc = src.startsWith('@private-content') 
    ? src.replace('@private-content', '/private-content')
    : src;

  return (
    <>
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${isDesktop && !isProjectThumbnail ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
        style={style}
        onClick={handleImageClick}
      />
      <Lightbox
        isOpen={isLightboxOpen}
        imageSrc={src}
        imageAlt={caption || alt}
        onClose={handleLightboxClose}
      />
    </>
  );
};

export default ClickableImage;
