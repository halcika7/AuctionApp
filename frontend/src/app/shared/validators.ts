import { FormControl, Validators, FormGroup } from "@angular/forms";

export const PASSWORD_VALIDATOR = (
  basic = false,
  name: string = "password"
) => {
  return !basic
    ? {
        [name]: new FormControl("", [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30),
          Validators.pattern(
            new RegExp(
              "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,30})"
            )
          )
        ])
      }
    : {
        [name]: new FormControl("", [Validators.required])
      };
};

export const EMAIL_VALIDATOR = (basic = false) => {
  return !basic
    ? {
        email: new FormControl("", [
          Validators.required,
          Validators.email,
          Validators.pattern(
            new RegExp(
              // tslint:disable-next-line: max-line-length
              "..[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
            )
          )
        ])
      }
    : {
        email: new FormControl("", [Validators.required, Validators.email])
      };
};

export const NAME_VALIDATOR = (name: string) => {
  return {
    [name]: new FormControl("", [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100)
    ])
  };
};

export const PHONE_VALIDATOR = (name: string) => {
  return {
    [name]: new FormControl("", [
      Validators.minLength(7),
      Validators.maxLength(15)
    ])
  };
}

export const BASIC_INPUT = (name: string, dValue: any = "") => {
  return {
    [name]: new FormControl(dValue, {})
  };
};

export const CARD_FIELD = (
  name: string,
  { value = "", min = 13, max = 16 }
) => {
  return {
    [name]: new FormControl(value, [
      Validators.minLength(min),
      Validators.maxLength(max)
    ])
  };
};

export const setErrors = (
  errors: any,
  objectProperty: string,
  form: FormGroup,
  message = false
) => {
  if (errors[objectProperty] && !message) {
    form.controls[objectProperty].setErrors({ async: errors[objectProperty] });
    form.controls[objectProperty].markAsTouched();
  } else {
    form.controls[objectProperty].setErrors({});
    form.controls[objectProperty].setValue(form.controls[objectProperty].value);
  }
};
