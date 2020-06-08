import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../posts.service';
import { Post } from '../post.model';
import { Subscription } from 'rxjs'
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

  // @Input()
  posts: Post[] = [];
  private postSub = new Subscription;
  isLoading: boolean = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(public postService: PostService) {}

  onDelete(id: string) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage) // This is observer
    this.postSub = this.postService.getPostUpdatedListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => { // This is the logic (subscribe) is executed whenever .next is called in observable
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts; // Argument is passed from Subject every time Subject.next() is executed.
        // We can invoke (emit) Subject.next(), Subject.error() & Subject.complete()
      })
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
