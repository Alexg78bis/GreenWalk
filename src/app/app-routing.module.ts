import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'

const routes: Routes = [
	{
		path: '',
		redirectTo: 'green-walks',
		pathMatch: 'full'
	},
	{
		path: 'login',
		loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
	},
	{
		path: 'register',
		loadChildren: () => import('./pages/register/register.module').then(m => m.RegistrationPageModule)
	},
	{
		path: 'green-walks',
		loadChildren: () => import('./pages/green-walks/green-walks.module').then(m => m.GreenWalksPageModule)
	},
	{ path: '**', redirectTo: 'green-walks' }
]

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule {}
