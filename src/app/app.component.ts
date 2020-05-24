import { Component } from '@angular/core';
import { Post } from './post/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  storedPost: Post[] = [];

  onPostAdded(post: any){
    this.storedPost.push(post);
  }
}
