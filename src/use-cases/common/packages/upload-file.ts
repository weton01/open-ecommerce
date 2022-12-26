export interface UploadFile {
  upload: (file: Buffer, folder: string, fileName: string) => Promise<string>
}
