import { Component, OnInit } from '@angular/core'; // importing Component from node_modules/angular/core.
import { PostService } from '../posts.service';
import { NgForm } from '@angular/forms'
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
  /* onAddPost(inputPost: HTMLTextAreaElement) {
    this.newPost = inputPost.value;
    alert('Post added!');
  } */

  /* @Output()
  postCreated = new EventEmitter <Post>();
  onAddPost(form: NgForm) {
    if(form.invalid) return;
    this.postCreated.emit({title: form.value.title, content: form.value.content});
  } */

  constructor(public postService: PostService) {}

  onAddPost(form: NgForm) {
    if(form.invalid) return;
    this.postService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
}
