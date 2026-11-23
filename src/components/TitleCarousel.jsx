import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TitleCard } from './TitleCard.jsx';

export const TitleCarousel = ({ titles, label }) => {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const track = trackRef.current;
    if (!track) return;

    setCanScrollLeft(track.scrollLeft > 4);
    setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 1);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    updateScrollButtons();
    const resizeObserver = new ResizeObserver(updateScrollButtons);
    resizeObserver.observe(track);

    return () => resizeObserver.disconnect();
  }, [titles.length]);

  const scroll = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * track.clientWidth * 0.8,
      behavior: 'smooth'
    });
  };

  return (
    <div className="title-carousel">
      <button
        type="button"
        className="title-carousel-control title-carousel-control-left"
        aria-label={`Scroll ${label} left`}
        onClick={() => scroll(-1)}
        disabled={!canScrollLeft}
      >
        <ChevronLeft size={22} />
      </button>
      <div
        className="title-carousel-track"
        ref={trackRef}
        onScroll={updateScrollButtons}
        aria-label={label}
      >
        {titles.map((item) => (
          <TitleCard key={item.id} title={item} />
        ))}
      </div>
      <button
        type="button"
        className="title-carousel-control title-carousel-control-right"
        aria-label={`Scroll ${label} right`}
        onClick={() => scroll(1)}
        disabled={!canScrollRight}
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
};
