import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public http: HttpClient) {




  }

  public Common_Test(postFix: any, data: any): Observable<any> {
    return this.http.post(postFix, data);
  }

  public Common_POST(postFix: any, data: any): Observable<any> {
    return this.http.post(environment.apiUrl + postFix, data);
  }

  public Common_GET(postFix: any): Observable<any> {
    return this.http.get(environment.apiUrl + postFix);
  }

  public Alert_Custom(message_text: any) {

    let msg: any = document.getElementById("message_alert");
    msg.style.display = "block";

    let docSelect: any = document.getElementById("message_text");
    docSelect.innerHTML = message_text;


    setTimeout(() => {
      msg.style.display = "none";
    }, 3000);
  }

  public ShowButtonLoader(classC: any, type: any) {
    var element: any = document.getElementById(classC);

    if (type == 1) {
      element.classList.add("button--loading");
    } else {
      element.classList.remove("button--loading");
    }
  }


  FormatDateMMDD(date: any) {
    debugger
    let dateParsed = new Date(date);
    let year = dateParsed.getFullYear();
    let month = (1 + dateParsed.getMonth()).toString().padStart(2, '0');
    let day = dateParsed.getDate().toString().padStart(2, '0');

    return month + '/' + day + '/' + year;
  }





}
