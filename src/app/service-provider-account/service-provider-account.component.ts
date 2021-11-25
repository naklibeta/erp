
import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-service-provider-account',
  templateUrl: './service-provider-account.component.html',
  styleUrls: ['./service-provider-account.component.css']
})
export class ServiceProviderAccountComponent implements OnInit {

  isLoading: boolean = false;

  OrderList: any[] = [];
  OrderListOrg: any[] = [];

  closeResult = '';
  //providerId: number = 0;
  DataLoaded: boolean = false;

  isSpinner: boolean = false;
  //ToClear: number = 0;
  fromDate: any = '';
  toDate: any = '';
  public providerId: any = '';
  public providerAccount: any = {};
  public TotalPay: any = 0;
  public OrderClearance: any = [];
  // StartDate:any = '';
  // EndDate:any = '';

  constructor(
    private changeDetector: ChangeDetectorRef,
    //private toastr: ToastrService,
    private apiService: ApiService,
    private modalService: NgbModal,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {


    this.providerId = localStorage.getItem('selectedProviderId');


  }

  ngOnInit(): void {
    var curr = new Date;
    var first = curr.getDate() - curr.getDay();
    var last = first + 6;
    let tempDate: any = new Date();
    tempDate.setDate(tempDate.getDate() - 7);
    this.fromDate = tempDate.toISOString().slice(0, 10);

    this.toDate = new Date().toISOString().slice(0, 10);


    this.getProvidersList(100, 1);
    this.GetProviderAccountDetails();
  }

  ngAfterViewInit(): void {
    // this.dtTrigger.next();
  }



  getProvidersList(limit: any, offset: any) {
    this.OrderList = [];
    this.apiService.Common_POST('/accounts/providerPaymentRecords',
      {
        providerId: this.providerId,
        from: this.fromDate,
        to: this.toDate
      }
    ).subscribe((results) => {
      if (results.statusCode == 200) {
        this.OrderListOrg = this.OrderList = results.data;
        //------------------------------------------Calculate Total to Pay---------------------------
        this.CalculateTotal(this.OrderList);
        //-------------------------------------------------------------------------------------------
      } else {
        this.OrderList = [];
      }

    });
  }


  CalculateTotal(OrdersList: any) {
    //------------------------------------------Calculate Total to Pay---------------------------
    this.TotalPay = 0;
    this.OrderClearance = [];
    let env = this;
    OrdersList.forEach((element: any) => {
      if (element.provider_commission) env.TotalPay = env.TotalPay + element.provider_commission;
      if (element.orderId) env.OrderClearance.push(element.orderId);
    });

    //----------------------------------Collect All Order Ids---------------------------------------
    console.log(env.OrderClearance, 'env.OrderClearance');




  }

  GetProviderAccountDetails() {
    this.OrderList = [];
    this.apiService.Common_POST('/accounts/providerAccountDetails', { providerId: this.providerId }).subscribe((results) => {
      if (results.statusCode == 200) {
        this.providerAccount = results.data;
      } else {
      }
    });
  }


  PaySP() {

    this.apiService.Common_POST('/accounts/clearProviderPayment', this.OrderClearance).subscribe((results) => {
      if (results.statusCode == 200) {
        //this.providerAccount = results.data;
      } else {
      }
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

}