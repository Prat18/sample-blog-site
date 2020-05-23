import { Component } from '@angular/core'; // importing Component from node_modules/angular/core.
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
//Component Decorator is used to make angular understand, this class is component.
//Component decorator takes some configuration in the form of a javascript object which we pass to it
//in that object we need to define things like the template, selector, .
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
//creating component
export class PostCreateComponent {
  //Declaring var/property
  //Adding method which is used in html file.
  //onAddPost(inputPost: HTMLTextAreaElement) {
    //this.newPost = inputPost.value;
    //alert('Post added!');
  //}
  //enteredTitle = '';
  //enteredContent = '';
  //@Output()
  //postCreated = new EventEmitter <Post>();

  constructor(public postsService: PostsService) {}

  onAddPost(form: NgForm) {
    if(form.invalid) return;
    this.postsService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
}
