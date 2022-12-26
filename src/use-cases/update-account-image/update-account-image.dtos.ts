export type FileType = { buffer: Buffer, mimeType: string }

export interface UpdateAccountImageDTO {
  id: string
  file?: FileType
}
