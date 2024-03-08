import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
  standalone: true
})
export class StatusPipe implements PipeTransform {

  transform(status: string): string {
    let newStatus = ''
    switch (status) {
      case 'isReady': {
        newStatus = 'Готов'
      }
        break;
      case 'notReady': {
        newStatus = 'Не готов'
      }
        break;
    }
    return newStatus
  }
}
