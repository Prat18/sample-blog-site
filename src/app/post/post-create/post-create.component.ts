import { Component, OnInit } from '@angular/core'; // importing Component from node_modules/angular/core.
import { PostService } from '../posts.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
//Component Decorator is used to make angular understand, this class is component.
//Component decorator takes some configuration in the form of a javascript object which we pass to it
//in that object we need to define things like the template, selector, .
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
//creating component
export class PostCreateComponent implements OnInit {
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

  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading: boolean = false;
  form: FormGroup;
  imagePreview: string;

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) return;
    this.isLoading = true;
    if (this.mode === 'edit') {
      console.log(this.postId);
      console.log(this.form.value.title, this.form.value.content);
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    this.form.reset();
  }

  onImagePicked(event: Event) {
    console.log(event);
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
