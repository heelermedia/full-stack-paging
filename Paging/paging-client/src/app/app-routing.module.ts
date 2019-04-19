import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MockDataResolverService } from './mock-data/mock-data-resolver.service';
import { MockDataComponent } from './mock-data/mock-data.component';

const routes: Routes = [
    {
        path: 'mock-data',
        component: MockDataComponent,
        resolve: {
            mockData: MockDataResolverService
        }
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
