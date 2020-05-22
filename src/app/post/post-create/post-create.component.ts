import { Component } from '@angular/core'; // importing Component from node_modules/angular/core.

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
  enteredValue = '';
  newPost = 'CONTEXT';
  //Adding method which is used in html file.
  //onAddPost(inputPost: HTMLTextAreaElement) {
    //this.newPost = inputPost.value;
    //alert('Post added!');
  //}
  onAddPost() {
    this.newPost = this.enteredValue;
  }
}
