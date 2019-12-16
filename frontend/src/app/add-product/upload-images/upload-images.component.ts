import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-upload-images",
  templateUrl: "./upload-images.component.html",
  styleUrls: ["./upload-images.component.scss"]
})
export class UploadImagesComponent implements OnInit {
  @Input() form: FormGroup;
  private _files: File[] = [];
  input;
  urls = [];

  constructor() {}

  ngOnInit() {
    this.loadFiles(this.form.value.images, true);
    this.input = this.form.get("images");
  }

  uploadFile(files) {
    this.loadFiles(files);
    this.setErrors();
  }
  deleteAttachment(event, index) {
    event.preventDefault();
    event.stopPropagation();
    this._files.splice(index, 1);
    this.urls.splice(index, 1);
    this.setErrors();
  }

  private loadFiles(files, onInit = false) {
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      if (!file || !file.type.match("image")) {
        return;
      } else {
        const reader = new FileReader();
        reader.onload = e => {
          this.urls.push(reader.result);
        };
        reader.readAsDataURL(file);
      }
      this._files.push(file);
    }
    if (!onInit) {
      this.form.patchValue({ images: this._files });
      this.form.get("images").updateValueAndValidity();
    }
  }

  private setErrors() {
    if (this._files.length == 0) {
      this.form.controls.images.setErrors({ required: true });
      this.form.controls.images.markAsTouched();
    } else if (this._files.length < 3) {
      this.form.controls.images.setErrors({ minlength: { requiredLength: 3 } });
      this.form.controls.images.markAsTouched();
    }
  }
}
