import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'
import { AuthentificationGuard } from './guards/authentification.guard'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home-tabs/home-tabs.module').then(
      m => m.HomeTabsPageModule),
    canActivate: [AuthentificationGuard],
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(
      m => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(
      m => m.RegistrationPageModule),
  },
  {
    path: 'green-walks',
    loadChildren: './pages/GreenWalk/green-walk.module#GreenWalkModule',
    canActivate: [AuthentificationGuard],
  },
  {
    path: '**',
    redirectTo: 'green-walks',
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
