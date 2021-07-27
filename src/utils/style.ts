import React from "react"

type StyleSheet = {
  [key: string]: React.CSSProperties | ((...params: any[]) => React.CSSProperties)
}

export function createStyleSheet<S extends StyleSheet>(styleSheet: S) {
  return styleSheet
}