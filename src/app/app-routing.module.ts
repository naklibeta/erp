import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';

import { ServiceProvidersComponent } from '../app/service-providers/service-providers.component';
import { CustomersComponent } from './customers/customers.component';
import { OrdersComponent } from './orders/orders.component';
import { PaymentsComponent } from './payments/payments.component';
import { LoginComponent } from './login/login.component';
import { ServiceProviderAccountComponent } from './service-provider-account/service-provider-account.component';



export const Approutes: Routes = [

  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'component',
        loadChildren: () => import('./component/component.module').then(m => m.ComponentsModule)
      },
      {
        path: 'service-providers',
        component: ServiceProvidersComponent
      },
      {
        path: 'customers',
        component: CustomersComponent
      },
      {
        path: 'orders',
        component: OrdersComponent
      },
      {
        path: 'payments',
        component: PaymentsComponent
      },
      {
        path: 'sp-accounts',
        component: ServiceProviderAccountComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
