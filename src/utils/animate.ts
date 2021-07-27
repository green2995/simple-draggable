import * as easings from "./easings"

interface AnimateParams {
  from: number
  to: number
  duration?: number
  delay?: number
  easing?: keyof typeof easings
  onEnd?: () => void
  onPause?: (latest: number) => void
  onUpdate?: (latest: number) => void
}

export function animate({
  from,
  to,
  duration = 1000,
  easing = "easeInOutSine",
  onEnd,
  onPause,
  onUpdate,
}: AnimateParams) {
  let animationFrameId: number;
  let latest = from;
  let start = -1;
  let progress = 0;

  function tick(time: number) {
    if (start === -1) {
      start = time;
    }

    progress = Math.min((time - start) / duration, 1.0);
    latest = from + easings[easing](progress) * (to - from);
    if (onUpdate) {
      onUpdate(latest);
    }

    if (progress === 1.0) {
      pause();
      if (onEnd) onEnd();
    } else {
      animationFrameId = requestAnimationFrame(tick);
    }
  }

  function pause() {
    cancelAnimationFrame(animationFrameId);

    if (onPause) {
      onPause(latest);
    }

  }
  
  animationFrameId = requestAnimationFrame(tick);

  return {
    pause,
  }
}