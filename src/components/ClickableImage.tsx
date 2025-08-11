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
    
  // Debug logging for development
  if (import.meta.env.DEV) {
    console.log('🔍 ClickableImage path resolution:', { 
      original: src, 
      resolved: imageSrc,
      finalPath: imageSrc.startsWith('@private-content') 
        ? imageSrc.replace('@private-content', '/private-content')
        : imageSrc
    });
    
    // Log individual values for clarity
    console.log('🔍 Original src:', src);
    console.log('🔍 Resolved imageSrc:', imageSrc);
    console.log('🔍 Final path:', imageSrc.startsWith('@private-content') 
      ? imageSrc.replace('@private-content', '/private-content')
      : imageSrc
    );
  }

  return (
    <>
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${isDesktop && !isProjectThumbnail ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
        style={style}
        onClick={handleImageClick}
        onLoad={() => {
          if (import.meta.env.DEV) {
            console.log('✅ Image loaded successfully:', imageSrc);
          }
        }}
        onError={(e) => {
          if (import.meta.env.DEV) {
            console.error('❌ Image failed to load:', imageSrc);
            console.error('❌ Error details:', e);
          }
        }}
      />
      <Lightbox
        isOpen={isLightboxOpen}
        imageSrc={imageSrc}
        imageAlt={caption || alt}
        onClose={handleLightboxClose}
      />
    </>
  );
};

export default ClickableImage;
