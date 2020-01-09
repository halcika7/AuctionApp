import { FormGroup } from "@angular/forms";
import { Component, OnInit, Input, OnChanges } from "@angular/core";

@Component({
  selector: "app-upload-photo",
  templateUrl: "./upload-photo.component.html",
  styleUrls: ["./upload-photo.component.scss"]
})
export class UploadPhotoComponent implements OnInit, OnChanges {
  @Input() imgUrl: string;
  @Input() parentForm: FormGroup;
  @Input() controlName: string;
  private _imgSrc: string | ArrayBuffer = "http://placehold.it/180";

  constructor() {}

  ngOnInit() {
    this._imgSrc = this.imgUrl;
  }

  ngOnChanges() {
    this._imgSrc = this.imgUrl;
  }

  onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    if (!file || !file.type.match("image")) {
      return;
    } else {
      this.parentForm.patchValue({ image: file });
      this.parentForm.get("image").updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = e => {
        this._imgSrc = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  get imgSrc(): string | ArrayBuffer {
    return this._imgSrc;
  }
}
