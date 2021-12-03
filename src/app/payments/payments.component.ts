
import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api.service';

declare var TableToExcel: any;

declare var $: any;

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

  isLoading: boolean = false;
  //private sub = new SubSink();

  PaymentList: any[] = [];
  PaymentListOrg: any[] = [];

  closeResult = '';
  providerId: number = 0;
  DataLoaded: boolean = false;

  isSpinner: boolean = false;
  PaymentDetails: any = {};
  objectKeys = Object.keys;
  PaymentDetailsEdit: any = {};
  fromDate: any;
  toDate: any;
  TotalPaymentClear: any = 0;
  ServiceProviders: any = 0;
  NoRecords: boolean = false;
  ProviderName: string = '';
  providerList: any = [];
  ShowListing: boolean = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    //private toastr: ToastrService,
    private apiService: ApiService,
    private modalService: NgbModal,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {

    this.setWeekDates();
  }

  ngOnInit(): void {
    // get datatable data
    this.getPaymentsList(100, 1);
  }

  ngAfterViewInit(): void {
    // this.dtTrigger.next();
  }

  setWeekDates() {
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    //var last = first + 6; // last day is the first day + 6

    this.fromDate = new Date(curr.setDate(first)).toISOString().slice(0, 10);
    this.toDate = new Date().toISOString().slice(0, 10);
  }

  DateChange() {
    this.getPaymentsList(100000, 1);
  }

  getPaymentsList(limit: any, offset: any) {
    let sendfrom = this.apiService.FormatDateMMDD(this.fromDate);
    let sendto = this.apiService.FormatDateMMDD(this.toDate);
    this.PaymentList = [];
    this.apiService.Common_POST('/accounts/getPaymentByDate', { limit: limit, offset: offset, from: sendfrom, to: sendto }).subscribe((results) => {
      if (results.statusCode == 200) {
        this.PaymentListOrg = this.PaymentList = results.data;
        if (this.PaymentList.length == 0) this.NoRecords = true;
        this.CalculateTotal();
      } else {
        this.PaymentList = [];
        if (this.PaymentList.length == 0) this.NoRecords = true;
      }
      this.changeDetector.markForCheck();
    });
  }

  CalculateTotal() {
    this.TotalPaymentClear = 0;
    this.ServiceProviders = 0;
    let AllSP: any = [];
    this.PaymentList.forEach((element) => {
      this.TotalPaymentClear = this.TotalPaymentClear + element.provider_commission;
      AllSP.push(element.sPName);
    });

    let s = new Set(AllSP);
    let it = s.values();
    AllSP = Array.from(it);
    this.ServiceProviders = AllSP.length;
  }

  SearchPaymentsList(limit: any, offset: any) {
    this.PaymentList = [];
    this.apiService.Common_POST('/accounts/getPaymentRecords', { limit: limit, offset: offset }).subscribe((results) => {
      if (results.statusCode == 200) {
        this.PaymentListOrg = this.PaymentList = results.data;
      } else {
        this.PaymentList = [];
      }
      this.changeDetector.markForCheck();
    });
  }


  SearchSP(SearchKey: any) {
    if (SearchKey.length == 0) {
      this.PaymentList = this.PaymentListOrg
      return;
    }

    if (SearchKey.length <= 2) {
      return;
    }

    this.apiService.Common_POST('/accounts/getPaymentRecords', { searchKey: SearchKey }).subscribe((results) => {
      if (results.statusCode == 200) {
        this.PaymentList = results.data;
      } else {
      }
    });

  }





  Rows(KeyRows: any) {
    this.getPaymentsList(KeyRows, 1);
  }


  open2(content2: string, PaymentDetailsVar: any) {
    this.PaymentDetails = PaymentDetailsVar;
    console.log(this.PaymentDetails);
    this.modalService.open(content2, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  open3(content3: string) {
    this.modalService.open(content3, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open4(content4: string, paymentData: any) {
    this.PaymentDetailsEdit = paymentData;

    this.modalService.open(content4, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  private getDismissReason(reason: ModalDismissReasons): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  Refund(paymentid: any, paymentvalue: any) {


    if (confirm('Are you sure? do you want to initiate refund for this order? ' + paymentid)) {
      this.apiService.Common_POST('/accounts/refundRequest', {
        "rzp_payment_id": paymentid,
        "amount": paymentvalue
      }).subscribe((results) => {
        if (results.statusCode == 200) {
          this.apiService.Alert_Custom('Refund has been initiated for this Order: ' + paymentid);
        } else {
          this.apiService.Alert_Custom('Refund has been initiated for this Order: ' + paymentid);
        }
      }, err => {
        this.apiService.Alert_Custom('Refund has been initiated for this Order: ' + paymentid);

      });
    } else {
    }
  }


  SavePaymentRecords(formvalues: any) {

    this.apiService.Common_POST('/accounts/saveOffline', formvalues).subscribe((results) => {
      if (results.statusCode == 200) {
        let tvar = document.getElementById("close_add");
        tvar?.click();
        this.ngOnInit();
        this.apiService.Alert_Custom('Payment record added successfully..');
      } else {
        alert('error while adding payment record');
      }
    }, err => {
      alert('error while adding payment record');

    });
  }


  EditPaymentRecords(formvalues: any) {

    this.apiService.Common_POST('/accounts/editPaymentRecord', formvalues).subscribe((results) => {
      if (results.statusCode == 200) {
        let tvar = document.getElementById("close_edit");
        tvar?.click();
        this.ngOnInit();
        this.apiService.Alert_Custom('Payment record added successfully..');
      } else {
        alert('error while adding payment record');
      }
    }, err => {
      alert('error while adding payment record');

    });
  }

  exportReportToExcel() {
    let fileNameT = 'payment-export-' + Math.floor(Math.random() * (999 - 100 + 1) + 100);
    let table = document.getElementsByTagName("table"); // you can use document.getElementById('tableId') as well by providing id to the table tag
    TableToExcel.convert(table[0], { // html code may contain multiple tables so here we are refering to 1st table tag
      name: fileNameT + `.xlsx`, // fileName you could use any name
      sheet: {
        name: 'Sheet 1' // sheetName
      }
    });
  }

  customSorting(type: any, keyFor: any) {

    this.PaymentList.sort(function (a, b) {
      var keyA = a[keyFor],
        keyB = b[keyFor];
      // Compare the 2 dates
      if (type == 'up') {
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
      } else {
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
      }

      return 0;
    });
  }

  SearchSPName(SearchKey: any) {

    if (SearchKey.length <= 2) {
      return;
    }
    this.apiService.Common_POST('/accounts/searchProvider', { searchKey: SearchKey }).subscribe((results) => {
      if (results.statusCode == 200) {
        this.ShowListing = true;
        this.providerList = results.data;
      } else {
      }
    });
  }


  SelectedProvider(name: any, id: any) {

    if (name.length == 0) {
      this.ShowListing = false;
    }
    this.ShowListing = false;
    this.ProviderName = name;

    let sendfrom = this.apiService.FormatDateMMDD(this.fromDate);
    let sendto = this.apiService.FormatDateMMDD(this.toDate);

    this.PaymentList = [];

    this.apiService.Common_POST('/accounts/getProviderPayment', { from: sendfrom, to: sendto, providerId: id }).subscribe((results) => {
      if (results.statusCode == 200) {
        this.PaymentListOrg = this.PaymentList = results.data;
        if (this.PaymentList.length == 0) this.NoRecords = true;
        this.CalculateTotal();
      } else {
        this.PaymentList = [];
        if (this.PaymentList.length == 0) this.NoRecords = true;
      }
      this.changeDetector.markForCheck();
    });


  }

}
