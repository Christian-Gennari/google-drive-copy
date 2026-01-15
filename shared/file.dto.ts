export interface FileDto {
  fileName: string; // Just the filename
  // We should use the relative path or filename as the ID if possible,
  // as the assignment uses paths in the URL (api/files/*).
  ownerName: string; // Name of the user who uploaded the file
  uploadedAt?: string; // String not Date because JSON converts Dates to strings anyways
  editedAt?: string; //  First value is derived by uploadedAt
  sizeInBytes?: number; // Size of the file
  fileBody?: string; // Base64 encoded file content
}
