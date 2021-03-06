import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { GroupsComponent } from './components/groups/groups.component';
import { DirectoryComponent } from './components/directory/directory.component';
import { AuthGuard } from './auth.guard';
import { GroupDetailsComponent } from './components/group-details/group-details.component';
import { CareerServicesComponent } from './components/career-services/career-services.component';
import { CreateGroupComponent } from './components/create-group/create-group.component';

const routes: Routes = [
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'email-verification', component: VerifyEmailComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'groups', component: GroupsComponent, canActivate: [AuthGuard] },
  {
    path: 'groups/:id',
    component: GroupDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-group',
    component: CreateGroupComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'directory',
    component: DirectoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'career-services',
    component: CareerServicesComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
