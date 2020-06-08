import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../posts.service';
import { Post } from '../post.model';
import { Subscription } from 'rxjs'

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

  constructor(public postService: PostService) {}

  onDelete(id: string) {
    this.postService.deletePost(id);
  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts() // This is observer
    this.postSub = this.postService.getPostUpdatedListener()
      .subscribe((posts: Post[]) => { // This is the logic (subscribe) is executed whenever .next is called in observable
        this.isLoading = false;
        this.posts = posts; // Argument is passed from Subject every time Subject.next() is executed.
        // We can invoke (emit) Subject.next(), Subject.error() & Subject.complete()
      })
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
