import { Post } from "./post.model";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private PostUpdated = new Subject;

  constructor (private http: HttpClient) {}

  getPost() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/post')
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.PostUpdated.next([...this.posts]);
        console.log(postData);
      })
  }

  getPostUpdatedListener() {
    return this.PostUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    console.log(post.title);
    this.http.post<{message: string}>('http://localhost:3000/post', post)
      .subscribe((message) => {
        console.log(message);
        this.posts.push(post);
        this.PostUpdated.next([...this.posts]);
      }) // this is observable
  }
}
