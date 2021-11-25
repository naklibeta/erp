import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  isLoading: boolean = false;
  //private sub = new SubSink();

  CustomerList: any[] = [];
  CustomerListOrg: any[] = [];

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
    this.getProvidersList(100, 1);
  }

  ngAfterViewInit(): void {
    // this.dtTrigger.next();
  }



  getProvidersList(limit: any, offset: any) {
    this.CustomerList = [];
    this.apiService.Common_POST('/accounts/allCustomer', { limit: limit, offset: offset }).subscribe((results) => {
      if (results.statusCode == 200) {
        this.CustomerListOrg = this.CustomerList = results.data;
      } else {
        this.CustomerList = [];
      }
      this.changeDetector.markForCheck();
    });
  }


  SearchSP(SearchKey: any) {

    if (SearchKey.length == 0) {
      this.CustomerList = this.CustomerListOrg
      return;
    }

    if (SearchKey.length <= 2) {
      return;
    }

    this.apiService.Common_POST('/accounts/searchCustomer', { searchKey: SearchKey }).subscribe((results) => {
      if (results.statusCode == 200) {
        this.CustomerList = results.data;
      } else {
      }
    });
  }


  Rows(KeyRows: any) {
    this.getProvidersList(KeyRows, 1);
  }

}
