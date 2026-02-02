"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  ZoomIn,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselImage {
  id: string;
  title?: string | null;
  description?: string | null;
  linkUrl?: string | null;
  linkType?: string | null;
  order: number;
  active: boolean;
  pinned?: boolean;
  autoPlayDuration?: number;
  Media: {
    id: string;
    filename: string;
    alt?: string | null;
    type?: string;
    mimeType?: string;
  };
}

export function HeroCarousel() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [expandedItem, setExpandedItem] = useState<CarouselImage | null>(null);

  useEffect(() => {
    async function fetchCarouselImages() {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(
          `/api/carousel?active=true&_t=${timestamp}`,
          {
            cache: "no-store",
            headers: {
              Pragma: "no-cache",
              "Cache-Control": "no-cache",
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          const sortedData = data.sort((a: CarouselImage, b: CarouselImage) => {
            // Pinned items first
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            // Then by order
            return a.order - b.order;
          });
          setImages(sortedData);
        }
      } catch (error) {
        console.error("Error fetching carousel images:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCarouselImages();
    // Removed frequent polling - only fetch once on mount
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (images.length <= 1) return;

    const currentImage = images[currentIndex];
    if (!currentImage) return;

    // If pinned, don't auto-advance
    if (currentImage.pinned) {
      setProgress(0);
      return;
    }

    // For videos, wait longer (30 seconds) to let video play
    const isVideo =
      currentImage.Media?.type === "VIDEO" ||
      currentImage.Media?.mimeType?.startsWith("video/");
    const duration = isVideo
      ? 30000
      : (currentImage.autoPlayDuration || 5) * 1000;

    const updateInterval = 100; // Less frequent updates (100ms vs 50ms)
    const totalSteps = duration / updateInterval;
    let currentStep = 0;

    setProgress(0);

    const progressInterval = setInterval(() => {
      currentStep++;
      setProgress((currentStep / totalSteps) * 100);
    }, updateInterval);

    const timeout = setTimeout(() => {
      let nextIndex = (currentIndex + 1) % images.length;

      // Removed the "skip pinned" logic.
      // Now it will advance to the next item naturally.
      // If the next item is pinned, the NEXT useEffect run will catch it
      // (lines 72-76) and stop the auto-play there.

      setCurrentIndex(nextIndex);
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [currentIndex, images]);

  const goToPrevious = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setProgress(0);
    setCurrentIndex(index);
  };

  const handleImageClick = (e: React.MouseEvent, item: CarouselImage) => {
    e.stopPropagation();
    e.preventDefault();

    if (!item.linkUrl) return;

    if (item.linkType === "DOWNLOAD") {
      window.open(item.linkUrl, "_blank");
    } else if (item.linkType === "EXTERNAL") {
      window.open(item.linkUrl, "_blank", "noopener,noreferrer");
    } else if (item.linkType === "VIEW") {
      window.open(item.linkUrl, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = item.linkUrl;
    }
  };

  if (loading) {
    return (
      <div className="relative h-[400px] lg:h-[550px] xl:h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10 bg-slate-200 animate-pulse" />
    );
  }

  if (images.length === 0) {
    return (
      <div className="relative h-[400px] lg:h-[550px] xl:h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
        <p className="text-slate-500 text-xl">No hay imágenes en el carrusel</p>
      </div>
    );
  }

  return (
    <div className="relative h-[450px] lg:h-[550px] xl:h-[600px] w-full max-w-full rounded-none overflow-hidden group bg-transparent">
      {/* Slides */}
      <div className="relative h-full w-full">
        {images.map((item, index) => {
          const isActive = index === currentIndex;
          const hasLink = !!item.linkUrl;
          const isVideo =
            item.Media?.type === "VIDEO" ||
            item.Media?.mimeType?.startsWith("video/");

          // Only render content for active slide to prevent performance issues
          const renderContent = () => {
            // If media is missing or filename is empty, render a placeholder
            if (!item.Media || !item.Media.filename) {
              return (
                <div className="absolute inset-0 w-full h-full bg-slate-200 flex items-center justify-center">
                  <span className="text-slate-500 text-sm">
                    Contenido no disponible
                  </span>
                </div>
              );
            }

            if (isVideo) {
              // Only load video when active
              if (isActive) {
                return (
                  <div className="relative w-full h-full">
                    <video
                      key={`video-${item.id}`}
                      src={
                        item.Media.filename.startsWith("/") ||
                        item.Media.filename.startsWith("http")
                          ? item.Media.filename
                          : `/uploads/${item.Media.filename}`
                      }
                      className="absolute inset-0 w-full h-full object-contain bg-transparent"
                      autoPlay
                      muted={isMuted}
                      loop={item.pinned}
                      playsInline
                      preload="metadata"
                      onEnded={() => {
                        if (!item.pinned) {
                          goToNext();
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(!isMuted);
                      }}
                      className="absolute bottom-6 right-6 z-30 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm"
                      aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                );
              } else {
                // Show placeholder for inactive video slides
                return (
                  <div className="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center">
                    <div className="text-slate-300 text-center">
                      <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center">
                        <ChevronRight className="w-8 h-8 text-slate-400" />
                      </div>
                      <span className="text-sm">Video</span>
                    </div>
                  </div>
                );
              }
            } else {
              return (
                <img
                  src={
                    item.Media.filename.startsWith("/") ||
                    item.Media.filename.startsWith("http")
                      ? item.Media.filename
                      : `/uploads/${item.Media.filename}`
                  }
                  alt={item.Media?.alt || item.title || "Carrusel"}
                  className="absolute inset-0 w-full h-full object-contain bg-transparent"
                  loading={isActive ? "eager" : "lazy"}
                />
              );
            }
          };

          return (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isActive
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {hasLink ? (
                <div
                  onClick={(e) => handleImageClick(e, item)}
                  className="h-full w-full cursor-pointer"
                >
                  {renderContent()}
                </div>
              ) : (
                renderContent()
              )}

              {/* Title/Description Overlay */}
              {(item.title || item.description) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end pointer-events-none">
                  <div className="p-6 text-white w-full">
                    {item.title && (
                      <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    )}
                    {item.description && (
                      <p className="text-sm opacity-90">{item.description}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expand Button (Top Right) - Only for active item */}
      {images[currentIndex] && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpandedItem(images[currentIndex]);
          }}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all duration-300 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100"
          title="Ver en pantalla completa"
        >
          <ZoomIn className="w-6 h-6" />
        </button>
      )}

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12 z-20 shadow-lg"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12 z-20 shadow-lg"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Progress Bar */}
      {images.length > 1 &&
        images[currentIndex] &&
        !images[currentIndex].pinned && (
          <div className="absolute top-4 left-4 right-4 z-20">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

      {/* Pinned Indicator */}
      {images[currentIndex]?.pinned && (
        <div className="absolute top-4 left-4 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-white/10">
          Anclada
        </div>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`h-2 rounded-full transition-all relative ${
                index === currentIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            >
              {img.pinned && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border border-white" />
              )}
            </button>
          ))}
        </div>
      )}
      {/* Lightbox Overlay */}
      {expandedItem && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-200"
          onClick={() => setExpandedItem(null)}
        >
          <button
            onClick={() => setExpandedItem(null)}
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 transition-colors z-50"
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="relative w-full h-full max-w-7xl max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {expandedItem.Media?.type === "VIDEO" ||
            expandedItem.Media?.mimeType?.startsWith("video/") ? (
              <video
                src={
                  expandedItem.Media.filename.startsWith("/") ||
                  expandedItem.Media.filename.startsWith("http")
                    ? expandedItem.Media.filename
                    : `/uploads/${expandedItem.Media.filename}`
                }
                className="w-full h-full object-contain max-h-[90vh]"
                controls
                autoPlay
              />
            ) : (
              <img
                src={
                  expandedItem.Media.filename.startsWith("/") ||
                  expandedItem.Media.filename.startsWith("http")
                    ? expandedItem.Media.filename
                    : `/uploads/${expandedItem.Media.filename}`
                }
                alt={expandedItem.title || "Expanded"}
                className="w-full h-full object-contain max-h-[90vh] shadow-2xl"
              />
            )}

            {/* Lightbox Caption */}
            {(expandedItem.title || expandedItem.description) && (
              <div className="absolute bottom-8 left-0 right-0 bg-black/70 text-white p-4 text-center rounded-xl backdrop-blur-md max-w-2xl mx-auto transition-opacity duration-300 hover:opacity-0 cursor-pointer">
                {expandedItem.title && (
                  <h3 className="text-xl font-bold">{expandedItem.title}</h3>
                )}
                {expandedItem.description && (
                  <p className="text-sm mt-1">{expandedItem.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
