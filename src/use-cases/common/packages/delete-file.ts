export interface DeleteFile {
  delete: (fileKey: string) => Promise<void>
}
