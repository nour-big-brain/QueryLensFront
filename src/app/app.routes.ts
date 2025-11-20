import { Routes } from '@angular/router';
import { HomeComponent } from './comp/home/home.component';
import { NotFoundComponent } from './comp/not-found/not-found.component';
import { DashboardComponent } from './comp/dashboard/dashboard.component';
import { CreateDashboardComponent } from './comp/create-dashboard/create-dashboard.component';
import { ListDashboardComponent } from './comp/list-dashboard/list-dashboard.component';
import { BuildQueryComponent } from './comp/build-query/build-query.component';
import { AjouterRoleComponent } from './comp/ajouter-role/ajouter-role.component';
import { ModifierRoleComponent } from './comp/modifier-role/modifier-role.component';
import { RolesListComponent } from './comp/roles-list/roles-list.component';
import { UserManagementComponent } from './comp/user-management/user-management.component';
import { DataSourceComponent } from './comp/data-source/data-source.component';
import { LoginComponent } from './comp/login/login.component';
import { SignupComponent } from './comp/signup/signup.component';
import { ProfileComponent } from './comp/profile/profile.component';

export const routes: Routes = [
    { path: 'home', title: 'Home', component: HomeComponent },

    //{ path: 'dashboard', title: 'Dashboard', component: DashboardComponent },
    { path: 'listDashboard', title: 'listDashboard', component: ListDashboardComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'profile', title:'profile', component: ProfileComponent},
    { path: 'user-management', title: 'User Management', component: UserManagementComponent },
    { path: 'data-source', title: 'datasource', component: DataSourceComponent },
    { path: 'roles', title: 'edit', component: RolesListComponent },
    { path: 'roles/modifier/:id', title: 'modify', component: ModifierRoleComponent },
    { path: 'roles/ajouter-role', title: 'add', component: AjouterRoleComponent },
    { path: 'dashboard/:id', title: 'dashboard', component: DashboardComponent },
    { path: 'createDashboard', title: 'create', component: CreateDashboardComponent },
    { path: 'buildQuery', title: 'form', component: BuildQueryComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', title: 'Not Found', component: NotFoundComponent }
];

