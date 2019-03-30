import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { StoreComponent } from './store/store.component';
import { BackendDetailsComponent } from './backend-details/backend-details.component';

const routes: Routes = [
  {path: '', component: OverviewComponent},
  {path: 'overview', component: OverviewComponent},
  {path: 'store', component: StoreComponent},
  {path: 'details/:name', component: BackendDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
