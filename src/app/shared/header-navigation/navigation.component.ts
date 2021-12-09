import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent {
  @Output()
  toggleSidebar = new EventEmitter<void>();
  public UserData: any;

  public showSearch = false;

  constructor(public router: Router) {
    let getD: any = localStorage.getItem("adminUser");
    let userD: any = JSON.parse(getD);
    this.UserData = userD.data;
  }


  logout() {
    localStorage.removeItem('adminUser');
    this.router.navigate(['/login']);
  }
}
