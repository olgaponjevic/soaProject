import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { ProfileComponent } from './features/profile/profile.component';
import { ProfileEditComponent } from './features/profile/profile-edit.component';
import { BlogFeedComponent } from './features/blogs/blog-feed.component';
import { BlogCreateComponent } from './features/blogs/blog-create.component';
import { BlogDetailComponent } from './features/blogs/blog-detail.component';
import { TourCreateComponent } from './features/tours/tour-create.component';
import { TourListComponent } from './features/tours/tour-list.component';
import { TourDetailComponent } from './features/tours/tour-detail.component';
import { CartComponent } from './features/cart/cart.component';
import { ToursBrowseComponent } from './features/tours/tours-browse.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'profile' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/edit', component: ProfileEditComponent, canActivate: [AuthGuard] },

  { path: 'blogs/feed', component: BlogFeedComponent, canActivate: [AuthGuard] },
  { path: 'blogs/new', component: BlogCreateComponent, canActivate: [AuthGuard] },
  { path: 'blogs/:id', component: BlogDetailComponent, canActivate: [AuthGuard] },
  { path: 'tours/new', component: TourCreateComponent, canActivate: [AuthGuard] },
  { path: 'tours/mine', component: TourListComponent, canActivate: [AuthGuard] },
  { path: 'tours/:id/edit', component: TourDetailComponent, canActivate: [AuthGuard] },
  { path: 'tours', component: ToursBrowseComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'profile' }
];