import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { emptyObject } from "@app/shared/checkEmptyObject";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import { faThinkPeaks } from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: "app-card-info",
  templateUrl: "./card-info.component.html",
  styleUrls: ["./card-info.component.scss"]
})
export class CardInfoComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() cardExp;
  private _asyncCardValidation: string;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.select("profile").subscribe(({ userInfo, errors }) => {
      if (!emptyObject(userInfo)) {
        this.form.patchValue({
          cName: !emptyObject(errors)
            ? this.form.value.cName
            : userInfo.CardInfo.name,
          cNumber: !emptyObject(errors)
            ? this.form.value.cNumber
            : userInfo.CardInfo.number,
          CVC: !emptyObject(errors)
            ? this.form.value.CVC
            : userInfo.CardInfo.cvc
        });
      }

      this._asyncCardValidation = errors.card;
    });
  }

  showCardExp(): boolean {
    return !emptyObject(this.cardExp) && this.cardExp.year != 0;
  }

  get cardValidationError(): string {
    return this._asyncCardValidation;
  }
}
