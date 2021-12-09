
import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  isLoading: boolean = false;

  OrderList: any[] = [];
  OrderListOrg: any[] = [];

  closeResult = '';
  providerId: number = 0;
  DataLoaded: boolean = false;

  isSpinner: boolean = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    //private toastr: ToastrService,
    private apiService: ApiService,
    private modalService: NgbModal,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    // this.getProvidersList();
  }

  ngOnInit(): void {
    // get datatable data
    this.getProvidersList(100, 0);
  }

  ngAfterViewInit(): void {
    // this.dtTrigger.next();
  }



  getProvidersList(limit: any, offset: any) {
    this.OrderList = [];
    this.apiService.Common_POST('/accounts/findOrders', { limit: limit, offset: offset }).subscribe((results) => {
      if (results.statusCode == 200) {
        this.OrderListOrg = this.OrderList = results.data;
      } else {
        this.OrderList = [];
      }
      this.changeDetector.markForCheck();
    });
  }


  SearchSP(SearchKey: any) {


    if (SearchKey.length == 0) {
      this.OrderList = this.OrderListOrg
      return;
    }

    if (SearchKey.length <= 2) {
      return;
    }

    this.apiService.Common_POST('/accounts/findOrders', { searchKey: SearchKey }).subscribe((results) => {
      if (results.statusCode == 200) {
        this.OrderList = results.data;
      } else {
      }
    });


  }


  Rows(KeyRows: any) {

    this.getProvidersList(KeyRows, 1);

  }



  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }



}

