import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Dish } from "../shared/dish";
import { DishService } from "../services/dish.service";
import { Params, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { switchMap } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Comment } from "../shared/comment";

@Component({
  selector: "app-dishdetail",
  templateUrl: "./dish-detail.component.html",
  styleUrls: ["./dish-detail.component.scss"]
})
export class DishDetailComponent implements OnInit {
  @ViewChild("cform")
  commentFormDirective;

  commentForm: FormGroup;
  comment: Comment;
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  formErrors = {
    author: "",
    comment: ""
  };

  validationMessages = {
    author: {
      required: "Name is required.",
      minlength: "Name must be at least 2 characters long."
    },
    comment: {
      required: "Comment is required."
    }
  };

  constructor(
    private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.dishservice
      .getDishIds()
      .subscribe(dishIds => (this.dishIds = dishIds));
    this.route.params
      .pipe(
        switchMap((params: Params) => this.dishservice.getDish(params["id"]))
      )
      .subscribe(dish => {
        this.dish = dish;
        this.setPrevNext(dish.id);
      });
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ["", [Validators.required, Validators.minLength(2)]],
      comment: ["", Validators.required],
      rating: 5
    });
    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) {
      return;
    }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + " ";
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      author: '',
      comment: '',
      rating: 5,
    });
    this.comment.date=new Date().toISOString();
    this.dish.comments.push(this.comment)

  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[
      (this.dishIds.length + index - 1) % this.dishIds.length
    ];
    this.next = this.dishIds[
      (this.dishIds.length + index + 1) % this.dishIds.length
    ];
  }

  goBack(): void {
    this.location.back();
  }
}
