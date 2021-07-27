export function isAllTrue(bools: boolean[]) {
  return bools.filter((bool) => bool === false).length === 0;
}

export function anyOf(bools: boolean[]) {
  return bools.filter((bool) => bool).length > 0;
}