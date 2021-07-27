import React from 'react'
import { animate } from '../utils/animate';
import { easeOutQuart } from '../utils/easings';
import { interpolate } from '../utils/number';

const MAX_UV_DISTANCE = Math.sqrt(2);

const Draggable = (props: DraggableProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const translatePrev = React.useRef({ x: 0, y: 0 }).current;
  const translate = React.useRef({ x: 0, y: 0 }).current;
  const touchStart = React.useRef({ x: 0, y: 0 }).current;
  const animation = React.useRef<ReturnType<typeof animate>>();
  const dragging = React.useRef(false);

  const padding = (() => {
    if (typeof props.padding === "object") return props.padding;
    let paddingSize = props.padding || 30;
    return {
      top: paddingSize,
      left: paddingSize,
      bottom: paddingSize,
      right: paddingSize
    };
  })();

  function setTranslate(x: number, y: number) {
    translate.x = x;
    translate.y = y;
    containerRef.current?.style.setProperty("transform", `
      translateX(${x}px)
      translateY(${y}px)
    `)
  }

  function onMouseDown(e: _MouseEvent) {
    dragging.current = true;
    animation.current?.pause()
    const { pageX, pageY } = e;
    touchStart.x = pageX;
    touchStart.y = pageY;
  }

  function onMouseMove(e: MouseEvent) {
    if (!dragging.current) return;
    if (!containerRef.current) return;

    const { pageX, pageY } = e;
    const boundary = getBoundary(containerRef.current, padding);

    const diff = {
      x: pageX - touchStart.x,
      y: pageY - touchStart.y,
    }

    const next = {
      x: Math.min(
        Math.max(
          translatePrev.x + diff.x,
          boundary.left,
        ),
        boundary.right
      ),
      y: Math.min(
        Math.max(
          translatePrev.y + diff.y,
          boundary.top,
        ),
        boundary.bottom
      ),
    }

    const uv = getUV(next, boundary);

    setTranslate(next.x, next.y);

    if (props.onDrag) {
      props.onDrag(e, uv);
    }
  }

  function onMouseUp(e: MouseEvent) {
    if (!dragging.current) return;
    if (!containerRef.current) return;
    
    if (props.recoverOnDrop) {
      recover()      
    } else {
      dragging.current = false;
      translatePrev.x = translate.x;
      translatePrev.y = translate.y;
    }

    if (props.onDrop) {
      props.onDrop(e)
    }
  }

  function recover() {
    if (!dragging.current) return;
    if (!containerRef.current) return;
    
    dragging.current = false;
    const boundary = getBoundary(containerRef.current, padding);

    const tempX = translate.x;
    const tempY = translate.y;

    const uv = getUV(translate, boundary);
    const distance = Math.sqrt(Math.pow(uv.x, 2.0) + Math.pow(uv.y, 2.0));
    const durationMultiplier = easeOutQuart(distance / MAX_UV_DISTANCE);

    animation.current?.pause();
    animation.current = animate({
      from: 0,
      to: 1,
      duration: 3000 * durationMultiplier,
      easing: "easeOutElastic",
      onUpdate: (latest) => {
        translatePrev.x = translate.x;
        translatePrev.y = translate.y;
        setTranslate(
          tempX - tempX * latest,
          tempY - tempY * latest
        );

        if (props.onRecover) {
          props.onRecover(getUV(translate, boundary));
        }
      },
    })
  }

  React.useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
  })

  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      style={{ userSelect: "none" }}>
      {props.children}
    </div>
  )
}

function getBoundary(target: HTMLDivElement, padding: Padding) {
  const {offsetLeft, offsetTop, clientHeight, clientWidth} = target
  // calculated based on translate
  const boundary = {
    left: -offsetLeft + padding.left,
    right: window.innerWidth - offsetLeft - clientWidth - padding.right,
    top: -offsetTop + padding.top,
    bottom: window.innerHeight - offsetTop - clientHeight - padding.bottom,
  }

  return boundary
}

/**
 * @description why sides(top, bottom, left, right) are considered?
 * 
 * offsetLeft and offsetTop of an element is a coordinate of top-left corner of the element.
 * 
 * This requires us to consider clientHeight and clientWidth
 * for calculating relative position of the element.
 */

function getUV(translate: Coordinate, boundary: {top: number, left: number, bottom: number, right: number}) {
  let x = 0, y = 0;
  if (translate.x >= 0) {
    x = interpolate(translate.x, 0, boundary.right, 0, 1);
  } else {
    x = interpolate(translate.x, boundary.left, 0, -1, 0)
  }

  if (translate.y >= 0) {
    y = interpolate(translate.y, 0, boundary.bottom, 0, 1);
  } else {
    y = interpolate(translate.y, boundary.top, 0, -1, 0);
  }

  return {x, y}
}

type _MouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

export type Coordinate = {
  x: number
  y: number
}

type Padding = {left: number, top: number, bottom: number, right: number}

export interface DraggableProps {
  children: React.ReactNode
  padding?: {
    left: number,
    right: number,
    top: number,
    bottom: number,
  } | number
  /**@param recoverOnDrop recover its original position on drop */
  recoverOnDrop?: boolean
  onDrag?: (e: MouseEvent, uv: Coordinate) => void
  onDrop?: (e: MouseEvent) => void
  onRecover?: (uv: Coordinate) => void
};

export default Draggable
