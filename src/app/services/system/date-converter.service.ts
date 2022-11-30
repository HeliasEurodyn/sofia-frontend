import { Injectable } from '@angular/core';
import {DatePipe} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class DateConverterService {

  constructor(private datepipe: DatePipe) { }

  public replaceIsoToClientDateFormatsInText(text: string){
    text = this.replaceIsoToClientDateFormatInText(text);
    text = this.replaceIsoToClientDateTimeFormatInText(text);
    return text;
  }

  public replaceIsoToClientDateFormatInText(text: string){
    const matchArray = text.match(/isoToClientDateFormat\([^\)]+\)/g);
    if(matchArray){
      matchArray.forEach(match => {
        const dateString = match.substring(22, match.length-1);
        const dateObj = new Date(dateString);
        const dateStringFormated = this.datepipe.transform(dateObj, 'dd/MM/yyyy');
        text = text.replace(match, dateStringFormated);
      });
    }
    return text;
  }

  public replaceIsoToClientDateTimeFormatInText(text: string){
    const matchArray = text.match(/isoToClientDateTimeFormat\([^\)]+\)/g);
    if(matchArray){
      matchArray.forEach(match => {
        const dateString = match.substring(26, match.length-1);
        const dateObj = new Date(dateString);
        const dateStringFormated = this.datepipe.transform(dateObj, 'dd/MM/yyyy hh:mm');
        text = text.replace(match, dateStringFormated);
      });
    }
    return text;
  }

}
