export interface Comparator {
  compare: (value: string, digest: string) => Promise<boolean>
}
