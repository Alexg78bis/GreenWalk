import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'

const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	},
	{
		path: 'home',
		redirectTo: 'folder/inbox',
		pathMatch: 'full'
	},
	{
		path: 'folder/:id',
		loadChildren: () => import('./folder/folder.module').then(m => m.FolderPageModule)
	},
	{
		path: 'login',
		loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
	},
	{
		path: 'register',
		loadChildren: () => import('./pages/register/register.module').then(m => m.RegistrationPageModule)
	}
]

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule {}
