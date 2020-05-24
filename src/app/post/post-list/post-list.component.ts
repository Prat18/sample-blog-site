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
  constructor(public postService: PostService) {}

  ngOnInit() {
    this.postSub = this.postService.getPostUpdatedListener() // This is observer
      .subscribe((posts: Post[]) => { // This is the logic (subscribe) is executed whenever .next is called in observable
        this.posts = posts; // Argument is passed from Subject every time Subject.next() is executed.
        // We can invoke (emit) Subject.next(), Subject.error() & Subject.complete()
      })
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
