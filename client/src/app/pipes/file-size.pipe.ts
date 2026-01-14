import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSizePipe',
})
export class FileSizePipe implements PipeTransform {
  /**
   * @param value The number in bytes
   * @param precision How many decimal places to show (defaults to 2)
   */
  transform(value: number, precision: number = 2): string {
    if (value === 0) return '0 B';
    if (!value && value !== 0) return '-';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const k = 1024;

    // Determine which unit to use
    const i = Math.floor(Math.log(value) / Math.log(k));

    // Format the number and remove trailing zeros
    const transformedValue = parseFloat((value / Math.pow(k, i)).toFixed(precision));

    return `${transformedValue} ${units[i]}`;
  }
}