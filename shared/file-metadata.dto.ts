export interface FileMetadataDto {
  // We should use the relative path or filename as the ID if possible,
  // as the assignment uses paths in the URL (api/files/*).
  id: string;
  ownerName: string;
  location: string; // Could be the folder path
  filename: string;
  filePath: string; // Full path including filename
  uploadedAt: string; // String not Date because JSON converts Dates to strings anyways
  sizeInBytes: number;
}
