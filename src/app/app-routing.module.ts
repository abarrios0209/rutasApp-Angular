import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './rutas/home/home.component';


const routes:Routes = [
  {
    path:'rutas',
    loadChildren: () => import('./rutas/rutas.module').then( m => m.RutasModule )
  },
  {
    path:'**',
    component:HomeComponent
  }
]


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class AppRoutingModule { }
