import {Pipe, PipeTransform} from '@angular/core';
import {House} from "../interfaces";

@Pipe({
  name: 'statusClass',
  standalone: true
})
export class StatusClassPipe implements PipeTransform {

  transform(house: House): string {
    let classStyle = ''

    if (house.statusReady == 'isReady' && !house.comments) classStyle = 'title-block-green'
    if (house.statusReady == 'notReady') classStyle = 'title-block-red'
    if (house.comments) classStyle = 'title-block-orange'

    return classStyle
  }
}
