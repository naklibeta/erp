import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api.service';

declare var TableToExcel: any;

declare var $: any;

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {

  isLoading: boolean = false;
  //private sub = new SubSink();

  ExpenseList: any[] = [];
  ExpenseListOrg: any[] = [];

  closeResult = '';
  providerId: number = 0;
  DataLoaded: boolean = false;

  isSpinner: boolean = false;
  ExpenseDetails: any = {};
  objectKeys = Object.keys;
  ExpenseDetailsEdit: any = {};

  constructor(
    private changeDetector: ChangeDetectorRef,
    //private toastr: ToastrService,
    private apiService: ApiService,
    private modalService: NgbModal,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    // this.getExpenseList();
  }

  ngOnInit(): void {
    // get datatable data
    this.getExpenseList(100, 0);
  }

  ngAfterViewInit(): void {
    // this.dtTrigger.next();
  }

  getExpenseList(limit: any, offset: any) {
    this.ExpenseList = [];
    this.apiService.Common_POST('/accounts/listOfExpenese', { limit: limit, offset: offset }).subscribe((results) => {
      if (results.statusCode == 200) {
        this.ExpenseListOrg = this.ExpenseList = results.data;
      } else {
        this.ExpenseList = [];
      }
      this.changeDetector.markForCheck();
    });
  }

  SearchExpenseList(limit: any, offset: any) {
    this.ExpenseList = [];
    this.apiService.Common_POST('/accounts/getExpenseRecords', { limit: limit, offset: offset }).subscribe((results) => {
      if (results.statusCode == 200) {
        this.ExpenseListOrg = this.ExpenseList = results.data;
      } else {
        this.ExpenseList = [];
      }
      this.changeDetector.markForCheck();
    });
  }


  SearchSP(SearchKey: any) {
    if (SearchKey.length == 0) {
      this.ExpenseList = this.ExpenseListOrg
      return;
    }

    if (SearchKey.length <= 2) {
      return;
    }

    this.apiService.Common_POST('/accounts/getExpenseRecords', { searchKey: SearchKey }).subscribe((results) => {
      if (results.statusCode == 200) {
        this.ExpenseList = results.data;
      } else {
      }
    });

  }





  Rows(KeyRows: any) {
    this.getExpenseList(KeyRows, 1);
  }


  open2(content2: string, ExpenseDetailsVar: any) {
    this.ExpenseDetails = ExpenseDetailsVar;
    console.log(this.ExpenseDetails);
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

  open4(content4: string, ExpenseData: any) {
    this.ExpenseDetailsEdit = ExpenseData;

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



  SaveExpenseRecords(formvalues: any) {

    formvalues.type = "Debit";

    this.apiService.Common_POST('/accounts/addExpense', formvalues).subscribe((results) => {
      if (results.statusCode == 200) {
        let tvar = document.getElementById("close_add");
        tvar?.click();
        this.apiService.Alert_Custom('Expense record added successfully..');
        this.ngOnInit();

      } else {
        alert('error while adding Expense record');
      }
    }, err => {
      alert('error while adding Expense record');

    });
  }

  EditExpenseRecords(formvalues: any) {

    this.apiService.ShowButtonLoader('edit-expense', 1);

    formvalues.type = "Debit";
    formvalues.id = this.ExpenseDetailsEdit.id;

    this.apiService.Common_POST('/accounts/updateExpense', formvalues).subscribe((results) => {
      if (results.statusCode == 200) {
        let tvar = document.getElementById("close_edit");
        tvar?.click();
        this.apiService.Alert_Custom('Expense record updated successfully..');
        this.ngOnInit();

      } else {
        alert('error while updating Expense record');
      }
      this.apiService.ShowButtonLoader('edit-expense', 0);
    }, err => {
      this.apiService.ShowButtonLoader('edit-expense', 0);
      alert('error while updating Expense record');

    });
  }


  exportReportToExcel() {
    let fileNameT = 'Expense-export-' + Math.floor(Math.random() * (999 - 100 + 1) + 100);
    let table = document.getElementsByTagName("table"); // you can use document.getElementById('tableId') as well by providing id to the table tag
    TableToExcel.convert(table[0], { // html code may contain multiple tables so here we are refering to 1st table tag
      name: fileNameT + `.xlsx`, // fileName you could use any name
      sheet: {
        name: 'Sheet 1' // sheetName
      }
    });
  }

}