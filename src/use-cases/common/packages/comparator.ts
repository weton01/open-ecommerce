export interface Comparator {
  compare: (value: string, password: string) => Promise<boolean>
}
