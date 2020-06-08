import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private PostUpdated = new Subject();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/post/')
      .pipe(
        map((postData) => {
          return postData.posts.map(
            (post: { title: any; _id: any; content: any, imagePath: any }) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath
              };
            }
          );
        })
      )
      .subscribe((postData) => {
        this.posts = postData;
        this.PostUpdated.next([...this.posts]);
      });
  }

  getPostUpdatedListener() {
    return this.PostUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string, imagePath: string }>(
      'http://localhost:3000/post/' + id
    );
  }

  addPost(title: string, content: string, image: File) {
    //const post: Post = { id: null, title: title, content: content };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/post/',
        postData
      )
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };
        this.posts.push(post);
        this.PostUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      }); // this is observable
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
        postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      }
    }
    this.http
      .put('http://localhost:3000/post/' + id, postData)
      .subscribe((responseData) => {
        console.log(responseData);
        const index = [...this.posts].findIndex((p) => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: ""
        }
        this.posts[index] = post;
        this.PostUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete('http://localhost:3000/post/' + postId)
      .subscribe((res) => {
        this.posts = this.posts.filter((post) => post.id !== postId);
        this.PostUpdated.next([...this.posts]);
        console.log(res);
      });
  }
}
