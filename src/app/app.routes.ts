import { Routes } from '@angular/router';
import { HomeComponent } from './comp/home/home.component';
import { NotFoundComponent } from './comp/not-found/not-found.component';
import { DashboardComponent } from './comp/dashboard/dashboard.component';
import { CreateDashboardComponent } from './comp/create-dashboard/create-dashboard.component';
import { ListDashboardComponent } from './comp/list-dashboard/list-dashboard.component';
import { DashboardItemComponent } from './comp/dashboard-item/dashboard-item.component';
import { BuildQueryComponent } from './comp/build-query/build-query.component';

export const routes: Routes = [
    { path: 'home', title: 'Home', component: HomeComponent }, 

    { path: 'dashboard', title: 'Dashboard', component: DashboardComponent },
    { path: 'listDashboard', title: 'listDashboard', component: ListDashboardComponent },
    { path: 'dashboarditem/:id' ,title: 'dashboarditem', component: DashboardItemComponent},
    { path: 'createDashboard', title: 'create', component: CreateDashboardComponent },
    { path: 'buildQuery', title: 'form', component: BuildQueryComponent }, 
    { path: '', redirectTo: 'home', pathMatch: 'full' }, 
    { path: '**', title: 'Not Found', component: NotFoundComponent }
];

