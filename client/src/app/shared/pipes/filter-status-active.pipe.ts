import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterStatusActive',
  standalone: true
})
export class FilterStatusActivePipe implements PipeTransform {

  transform<T extends {status? : boolean }>(elements: T []): T[] {
    return elements.filter(x => x.status)
  }
}
