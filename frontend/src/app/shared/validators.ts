import {
  FormControl,
  Validators,
  FormGroup,
  AbstractControl
} from "@angular/forms";

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
        email: new FormControl("", [Validators.required, Validators.email])
      }
    : {
        email: new FormControl("", [Validators.required, Validators.email])
      };
};

export const NAME_VALIDATOR = (
  name: string,
  min: number = 1,
  max: number = 100,
  extraValidators: any[] = []
) => {
  return {
    [name]: new FormControl("", [
      Validators.required,
      Validators.minLength(min),
      Validators.maxLength(max),
      ...extraValidators
    ])
  };
};

export const PHONE_VALIDATOR = (name: string, required: boolean = false) => {
  return !required
    ? {
        [name]: new FormControl("", [
          Validators.minLength(7),
          Validators.maxLength(15)
        ])
      }
    : {
        [name]: new FormControl("", [
          Validators.minLength(7),
          Validators.maxLength(15),
          Validators.required
        ])
      };
};

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
    form.controls[objectProperty].markAsTouched({ onlySelf: true });
  } else {
    form.controls[objectProperty].setErrors({});
    form.controls[objectProperty].setValue(
      form.controls[objectProperty].value,
      { onlySelf: true }
    );
  }
};

export const numberOfWordsValidator = (min = 2, max = 5) => {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const length = control.value.split(" ").filter(n => n != "").length;
    if (length < min && !max) {
      return {
        numberOfWordsValidator: { min }
      };
    } else if (length < min || (max && length > max)) {
      return {
        numberOfWordsValidator: { min, max }
      };
    }
    return null;
  };
};

export const setValidators = (controls: any[], names: string[]) => {
  controls.forEach((control: FormControl, index: number) => {
    if (names[index] == "cName") {
      control.setValidators([Validators.required, Validators.maxLength(100)]);
    } else if (names[index] == "cardNumber") {
      control.setValidators([
        Validators.required,
        Validators.maxLength(16),
        Validators.minLength(13)
      ]);
    } else if (names[index] == 'cardCvc') {
      control.setValidators([
        Validators.required,
        Validators.maxLength(4),
        Validators.minLength(3)
      ]);
    }
    control.updateValueAndValidity({ onlySelf: true });
  });
};

export const clearValidators = (controls: any[]) => {
  controls.forEach((control: FormControl) => {
    control.clearValidators();
    control.markAsUntouched({ onlySelf: true });
    control.patchValue("", { onlySelf: true });
    control.updateValueAndValidity({ onlySelf: true });
  });
};

export const updateValueAndValidity = (controls: any[]) => {
  controls.forEach((control: FormControl) => {
    control.updateValueAndValidity({ onlySelf: true });
  });
};
