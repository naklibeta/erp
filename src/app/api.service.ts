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

    let dateParsed = new Date(date);
    let year = dateParsed.getFullYear();
    let month = (1 + dateParsed.getMonth()).toString().padStart(2, '0');
    let day = dateParsed.getDate().toString().padStart(2, '0');

    return month + '/' + day + '/' + year;
  }


  JobStatus(status: any) {
    if (status == 0) { return 'Open'; }
    else if (status == 1) { return 'Accepted'; }
    else if (status == 2) { return 'Quotation Sent to User'; }
    else if (status == 3) { return 'Quotation Accepted'; }
    else if (status == 4) { return 'Quotation Rejected'; }
    else if (status == 5) { return 'Start Work'; }
    else if (status == 6) { return 'End Work'; }
    else if (status == 7) { return 'Order Cancelled'; }
    else if (status == 8) { return 'Payment Received'; }
    else if (status == 9) { return 'Refund Initiated'; }
    else if (status == 10) { return 'Refund Processed'; }
    else { return ''; }
  }




}
