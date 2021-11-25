import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public api: ApiService, public router: Router) { }

  ngOnInit(): void {
  }

  LoginNow(value: any) {

    this.api.Common_POST('/auth/login', value).subscribe((results) => {
      if (results.statusCode == 200) {
        localStorage.setItem("adminUser", JSON.stringify(results));
        this.router.navigate(['/dashboard']);
      } else {
        alert('Unable to login: ' + JSON.stringify(results));
      }
    }, err => {
      alert('Unable to login: ' + JSON.stringify(err));

    });
  }

}
