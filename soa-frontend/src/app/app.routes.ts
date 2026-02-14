import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { ProfileComponent } from './features/profile/profile.component';
import { ProfileEditComponent } from './features/profile/profile-edit.component';
import { BlogFeedComponent } from './features/blogs/blog-feed.component';
import { BlogCreateComponent } from './features/blogs/blog-create.component';
import { BlogDetailComponent } from './features/blogs/blog-detail.component';
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

  { path: '**', redirectTo: 'profile' }
];