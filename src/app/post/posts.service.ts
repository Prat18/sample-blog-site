import { Post } from "./post.model";
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators'
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private PostUpdated = new Subject;

  constructor (private http: HttpClient) {}

  getPost() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/post')
      .pipe(map((postData) => {
        return postData.posts.map((post: { title: any, _id: any; content: any; }) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          }
        })
      }))
      .subscribe((postData) => {
        this.posts = postData;
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
    this.http.post<{message: string, postId: string}>('http://localhost:3000/post', post)
      .subscribe((result) => {
        post.id = result.postId;
        this.posts.push(post);
        this.PostUpdated.next([...this.posts]);
      }) // this is observable
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/post' + postId)
      .subscribe((res) => {
        this.posts = this.posts.filter(post => post.id !== postId);
        this.PostUpdated.next([...this.posts]);
        console.log(res);
      })
  }
}
