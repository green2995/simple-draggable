import React, { useImperativeHandle } from 'react'
import { createStyleSheet } from '../utils/style'

const baseTransform = "scale(0.65)"
const defaultRotation = {
  x: -45,
  y: 45,
  z: 0,
}

const Box = React.forwardRef<BoxRef, BoxProps>(({
  size = 200
},
  ref
) => {
  const boxRef = React.useRef<HTMLDivElement>(null);
  const rotation = React.useRef({...defaultRotation}).current;

  function setRotation(x: number, y: number, z: number) {
    if (!boxRef.current) return;
    rotation.x = x;
    rotation.y = y;
    rotation.z = z;
    boxRef.current.style.setProperty("transform", `
      ${baseTransform}
      rotateX(${x}deg)
      rotateY(${y}deg)
      rotateZ(${z}deg)
    `)
  }

  function rotate(x: number, y: number, z: number) {
    if (!boxRef.current) return;
    setRotation(rotation.x + x, rotation.y + y, rotation.z + z);
  }

  useImperativeHandle(ref, () => {
    return {
      rotate,
      setRotation,
      defaultRotation,
      rotation,
    }
  })

  return (
    <div style={{ perspective: 500 }}>
      <div ref={boxRef} style={{
        width: size,
        height: size,
        transform: `
          scale(0.65)
          rotateX(${defaultRotation.x}deg)
          rotateY(${defaultRotation.y}deg)
          rotateZ(${defaultRotation.z}deg)
        `,
        transformStyle: "preserve-3d",
      }}>
        <div style={styles.leftSide(size)} />
        <div style={styles.rightSide(size)} />
        <div style={styles.topSide(size)} />
        <div style={styles.bottomSide(size)} />
        <div style={styles.frontSide(size)} />
        <div style={styles.backSide(size)} />
      </div>
    </div>
  )
})

export interface BoxProps {
  size?: number
}

export interface BoxRef {
  setRotation: (x: number, y: number, z: number) => void
  rotate: (x: number, y: number, z: number) => void
  defaultRotation: {x: number, y: number, z: number}
  rotation: {x: number, y: number, z: number}
}

const baseStyles = createStyleSheet({
  side: {
    width: 200,
    height: 200,
    transformStyle: "preserve-3d",
    position: "absolute",
  }
})

const styles = createStyleSheet({
  leftSide: (size: number) => ({
    ...baseStyles.side,
    backgroundColor: "pink",
    transform: `rotateY(-90deg) translateZ(${size / 2}px)`,
  }),
  rightSide: (size: number) => ({
    ...baseStyles.side,
    backgroundColor: "ivory",
    transform: `rotateY(90deg) translateZ(${size / 2}px)`,
  }),
  topSide: (size: number) => ({
    ...baseStyles.side,
    backgroundColor: "springgreen",
    transform: `rotateX(90deg) translateZ(${size / 2}px)`,
  }),
  bottomSide: (size: number) => ({
    ...baseStyles.side,
    backgroundColor: "darksalmon",
    transform: `rotateX(-90deg) translateZ(${size / 2}px)`,
  }),
  frontSide: (size: number) => ({
    ...baseStyles.side,
    backgroundColor: "cornflowerblue",
    transform: `translateZ(${size / 2}px)`,
  }),
  backSide: (size: number) => ({
    ...baseStyles.side,
    backgroundColor: "blue",
    transform: `rotateY(180deg) translateZ(${size / 2}px)`,
  }),
})

export default Box
