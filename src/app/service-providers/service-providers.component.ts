import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api.service';
//import * as _ from 'underscore';
declare var $: any;

@Component({
  selector: 'app-service-providers',
  templateUrl: './service-providers.component.html',
  styleUrls: ['./service-providers.component.css']
})



export class ServiceProvidersComponent implements OnInit {

  isLoading: boolean = false;
  //private sub = new SubSink();
  providerList: any[] = [];
  providerListOrg: any[] = [];
  closeResult = '';
  providerId: number = 0;
  DataLoaded: boolean = false;
  isSpinner: boolean = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    //private toastr: ToastrService,
    private apiService: ApiService,
    private modalService: NgbModal,
    private componentFactoryResolver: ComponentFactoryResolver,
    public router: Router
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
    this.providerList = [];
    this.apiService.Common_POST('/accounts/allProvider', { limit: limit, offset: offset }).subscribe((results) => {
      if (results.statusCode == 200) {
        this.providerListOrg = this.providerList = results.data;


      } else {
        this.providerList = [];
      }
      this.changeDetector.markForCheck();
    });
  }


  SearchSP(SearchKey: any) {


    if (SearchKey.length == 0) {
      this.providerList = this.providerListOrg
      return;
    }

    if (SearchKey.length <= 2) {
      return;
    }

    this.apiService.Common_POST('/accounts/searchProvider', { searchKey: SearchKey }).subscribe((results) => {
      if (results.statusCode == 200) {
        this.providerList = results.data;
      } else {
      }
    });


  }


  SP_Orders(providerId: any) {
    localStorage.setItem('selectedProviderId', providerId);

    this.router.navigate(['/sp-accounts']);

  }


  Rows(KeyRows: any) {

    this.getProvidersList(KeyRows, 1);

  }



  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



}
