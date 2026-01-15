import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileIcon',
  standalone: true,
})
export class FileIconPipe implements PipeTransform {
  /**
   * Transforms a file name into the correct icon name for the IconsComponent.
   * Usage in template: {{ 'image.png' | fileIcon }} or [name]="file.name | fileIcon"
   */
  transform(fileName: string | undefined, isFolder: boolean = false): string {
    if (isFolder) {
      return 'folder';
    }

    // Handle null/undefined or files with no extension
    if (!fileName || !fileName.includes('.')) {
      return 'document';
    }

    // Get extension (lowercase for comparison)
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    switch (extension) {
      // Images
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'webp':
      case 'svg':
      case 'bmp':
      case 'ico':
      case 'tiff':
        return 'photo';

      // Audio
      case 'mp3':
      case 'wav':
      case 'ogg':
      case 'flac':
      case 'aac':
      case 'm4a':
        return 'audio';

      // Video
      case 'mp4':
      case 'mov':
      case 'avi':
      case 'mkv':
      case 'webm':
      case 'wmv':
      case 'flv':
        return 'video';

      // Spreadsheets
      case 'xls':
      case 'xlsx':
      case 'csv':
      case 'ods':
      case 'numbers':
        return 'spreadsheet';

      // Presentations
      case 'ppt':
      case 'pptx':
      case 'key':
      case 'odp':
        return 'presentation';

      // Code
      case 'html':
      case 'htm':
      case 'css':
      case 'scss':
      case 'sass':
      case 'js':
      case 'ts':
      case 'json':
      case 'xml':
      case 'py':
      case 'java':
      case 'c':
      case 'cpp':
      case 'php':
      case 'sql':
        return 'code-bracket';

      // Archives
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
      case 'pkg':
        return 'zips';

      // Default Documents
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
      case 'rtf':
      case 'md':
      default:
        return 'document';
    }
  }
}