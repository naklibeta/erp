import { Component, AfterViewInit } from '@angular/core';
// import { ChartsModule } from 'ng2-charts';
import { ApiService } from '../api.service';
declare var require: any;
@Component({
  templateUrl: './dashboard.component.html'
})



export class DashboardComponent implements AfterViewInit {
  subtitle: string;
  public DashboardData: any;
  constructor(public api: ApiService) {
    this.subtitle = 'This is some text within a card block.';

    this.DashboardData = {};
  }



  // lineChart
  public lineChartData: Array<object> = [
    { data: [8, 13, 1, 13, 1], label: 'Product A' },
    { data: [14, 1, 14, 1, 14], label: 'Product B' }
  ];
  public lineChartLabels: Array<string> = [
    '1',
    '2',
    '3',
    '4',
    '5',
  ];
  public lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };
  public lineChartColors = [
    {
      // grey
      backgroundColor: 'rgba(0,158,251,0.1)',
      borderColor: '#009efb',
      pointBackgroundColor: '#009efb',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#009efb'
    },
    {
      // dark grey
      backgroundColor: 'rgba(85,206,99,0.1)',
      borderColor: '#55ce63',
      pointBackgroundColor: '#55ce63',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#55ce63'
    }
  ];
  public lineChartLegend = false;
  public lineChartType = 'line';


  monthlyProject: any = [


    {
      trClass: '',
      tdWidth: 'width:50px',
      spanClass: 'round',
      spanLetter: 'S',
      image: '',
      name: 'Sunil Joshi',
      designation: 'Web Designer',
      project: 'Elite Admin',
      budget: 3.9
    },
    {
      trClass: '',
      tdWidth: '',
      spanClass: 'round',
      spanLetter: '',
      image: 'assets/images/users/2.jpg',
      name: 'Andrew',
      designation: 'Project Manager',
      project: 'Real Homes',
      budget: 23.9
    },
    {
      trClass: '',
      tdWidth: 'width:50px',
      spanClass: 'round round-success',
      spanLetter: 'B',
      image: '',
      name: 'Bhavesh patel',
      designation: 'Developer',
      project: 'MedicalPro Theme',
      budget: 12.9
    },
    {
      trClass: '',
      tdWidth: 'width:50px',
      spanClass: 'round round-primary',
      spanLetter: 'N',
      image: '',
      name: 'Nirav Joshi',
      designation: 'Web Designer',
      project: 'Frontend Eng',
      budget: 10.9
    },
    {
      trClass: '',
      tdWidth: '',
      spanClass: 'round round-warning',
      spanLetter: 'M',
      image: '',
      name: 'Micheal Doe',
      designation: 'Content Writer',
      project: 'Helping Hands',
      budget: 3.9
    },
    {
      trClass: '',
      tdWidth: '',
      spanClass: 'round round-danger',
      spanLetter: 'J',
      image: '',
      name: 'Johnathan',
      designation: 'Graphic',
      project: 'Digital Agency',
      budget: 2.6
    },



  ]



  ngAfterViewInit() {

    this.api.Common_GET('/accounts/dashboard').subscribe((results) => {
      if (results.statusCode == 200) {
        this.DashboardData = results.data;
      } else {
      }
    });



  }
}
