import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PaintingsComponent } from './paintings/paintings.component';
import { PaintingRegistrationComponent } from './painting-registration/painting-registration.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { LoginComponent } from './login/login.component';
import { PaintingComponent } from './painting/painting.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UpdatePaintingComponent } from './update-painting/update-painting.component';
import { UpdateUserComponent } from './update-user/update-user.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: HomeComponent },
    { path: 'paintings', component: PaintingsComponent },
    { path: 'paintings/:id', component: PaintingComponent },
    { path: 'add-painting', component: PaintingRegistrationComponent },
    { path: 'update-painting', component: UpdatePaintingComponent },
    { path: 'add-user', component: UserRegistrationComponent },
    { path: 'update-user', component: UpdateUserComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', component: PageNotFoundComponent }

];
