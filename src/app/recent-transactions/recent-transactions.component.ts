
import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api.service';

declare var TableToExcel: any;

declare var $: any;

@Component({
  selector: 'app-recent-transactions',
  templateUrl: './recent-transactions.component.html',
  styleUrls: ['./recent-transactions.component.css']
})
export class RecentTransactionsComponent implements OnInit {
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

  constructor(
    private changeDetector: ChangeDetectorRef,
    //private toastr: ToastrService,
    private apiService: ApiService,
    private modalService: NgbModal,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    // this.getPaymentsList();
  }

  ngOnInit(): void {
    // get datatable data
    this.getPaymentsList(100, 1);
  }

  ngAfterViewInit(): void {
    // this.dtTrigger.next();
  }

  getPaymentsList(limit: any, offset: any) {
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

}
