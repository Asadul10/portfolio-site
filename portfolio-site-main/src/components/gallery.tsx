'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectImage } from '@/types';

interface GalleryProps {
  images: ProjectImage[];
  activeIndex?: number;
  onImageChange?: (index: number) => void;
}

export function Gallery({ images, activeIndex = 0, onImageChange }: GalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(activeIndex);

  const nextImage = () => {
    const next = (currentIndex + 1) % images.length;
    setCurrentIndex(next);
    onImageChange?.(next);
  };

  const prevImage = () => {
    const prev = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(prev);
    onImageChange?.(prev);
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  if (images.length === 0) return null;

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].caption || `Gallery image ${currentIndex + 1}`}
            fill
            className="object-cover cursor-pointer transition-transform hover:scale-105"
            onClick={() => openLightbox(currentIndex)}
          />
          <div className="absolute inset-0 bg-black/0 transition-colors hover:bg-black/20 flex items-center justify-center">
            <ZoomIn className="h-8 w-8 text-white opacity-0 transition-opacity hover:opacity-100" />
          </div>
          {images[currentIndex].caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white">
              <p className="text-sm">{images[currentIndex].caption}</p>
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  onImageChange?.(index);
                }}
                className={`relative aspect-video w-20 shrink-0 overflow-hidden rounded-md transition-all ${
                  index === currentIndex
                    ? 'ring-2 ring-primary-500'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.caption || `Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Navigation Controls */}
        {images.length > 1 && (
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevImage}
              disabled={images.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextImage}
              disabled={images.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-7xl w-full h-full max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle>
                {images[currentIndex].caption || `Image ${currentIndex + 1} of ${images.length}`}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeLightbox}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="relative flex-1 p-6">
            <div className="relative h-full w-full">
              <Image
                src={images[currentIndex].src}
                alt={images[currentIndex].caption || `Gallery image ${currentIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>
            
            {/* Lightbox Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
