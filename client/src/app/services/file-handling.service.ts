import {Injectable, signal} from '@angular/core';
import { FileDto} from '../../../../shared/file-metadata.dto';

@Injectable({
  providedIn: 'root',
})
export class FileHandlingService {

  content = signal<File | null>(null);

  convertToBase64(content: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        console.log(resolve(base64));
      };
      reader.onerror = reject;
      reader.readAsDataURL(content);     
    });
  }



  /*
  
  Metod som konverterar från fil-format till bytes

  Metod som konverterar från bytes till fil-format

  Metod upload för att ladda upp fil - anropa PUT i APIn

  */

}
