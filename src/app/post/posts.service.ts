import { Post } from "./post.model";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private PostUpdated = new Subject;

  /* getPost() {
    return this.posts;
  } */

  getPostUpdatedListener() {
    return this.PostUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post = {title: title, content: content};
    this.posts.push(post);
    this.PostUpdated.next(this.posts); // this is observable
  }
}
