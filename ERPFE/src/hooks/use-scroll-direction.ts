import { useEffect, useState } from "react";

export type ScrollDirection = "up" | "down";

/** Whether the page is near the top, and which way the user last scrolled. */
export function useScrollDirection({ topOffset = 24, threshold = 4 } = {}) {
  const [atTop, setAtTop] = useState(true);
  const [direction, setDirection] = useState<ScrollDirection>("up");

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      setAtTop(y < topOffset);
      if (delta > threshold) setDirection("down");
      else if (delta < -threshold) setDirection("up");
      lastY = y;
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [topOffset, threshold]);

  return { atTop, direction };
}
