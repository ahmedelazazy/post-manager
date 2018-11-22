import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './components/post/post-list/post-list.component';
import { PostCreateComponent } from './components/post/post-create/post-create.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: PostListComponent },
  { path: 'create', component: PostCreateComponent },
  { path: 'edit/:id', component: PostCreateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
