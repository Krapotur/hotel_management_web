import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'find',
  standalone: true
})
export class FindPipe implements PipeTransform {

  transform<T extends { title?: string }>(elements: T[], search: string = ''): T[] {
    if (!search.trim()) return elements

    return elements.filter(x => x.title.toLowerCase().includes(search))
  }
}
