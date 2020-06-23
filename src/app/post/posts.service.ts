import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private PostUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postperPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postperPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        'http://localhost:3000/post/' + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map(
              (post: {
                title: any;
                _id: any;
                content: any;
                imagePath: any;
                creator: any;
              }) => {
                return {
                  title: post.title,
                  content: post.content,
                  id: post._id,
                  imagePath: post.imagePath,
                  creator: post.creator
                };
              }
            ),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        console.log(transformedPostData);
        this.posts = transformedPostData.posts;
        this.PostUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts,
        });
      });
  }

  getPostUpdatedListener() {
    return this.PostUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>('http://localhost:3000/post/' + id);
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
        this.router.navigate(['/']);
      }); // this is observable
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put('http://localhost:3000/post/' + id, postData)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete('http://localhost:3000/post/' + postId);
  }
}
