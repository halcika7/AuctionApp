import { Component, OnInit } from "@angular/core";
import { ProfileService } from "./../profile.service";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as ProfileActions from "../store/profile.actions";

@Component({
  selector: "app-profile-settings",
  templateUrl: "./profile-settings.component.html",
  styleUrls: ["./profile-settings.component.scss"]
})
export class ProfileSettingsComponent implements OnInit {
  private _email: string;
  private _phone: string;
  private _showModal: boolean = false;
  constructor(
    private profileService: ProfileService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.profileService.changeBreadcrumb("settings");
    this.store.dispatch(new ProfileActions.ProfileStart("/profile/userInfo"));
    this.store
      .select("profile")
      .subscribe(({ userInfo: { email, phoneNumber } }) => {
        if (email != undefined) {
          this._email = email;
        }
        if (phoneNumber != undefined) {
          this._phone = phoneNumber;
        }
      });
  }

  openModal(value: boolean = true) {
    this._showModal = value;
  }

  deactivateAccount() {
    this.store.dispatch(new ProfileActions.DeactivateAccount());
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
  }

  get email(): string {
    return this._email;
  }

  get phone(): string {
    return this._phone;
  }

  get showModal(): boolean {
    return this._showModal;
  }
}
