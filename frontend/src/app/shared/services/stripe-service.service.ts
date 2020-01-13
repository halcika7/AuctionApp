import { Subject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class StripeServiceService {
  private style = {
    base: {
      fontWeight: 300,
      fontSize: "18px"
    }
  };
  private elements = (<any>window).stripe.elements();
  private cardNumber;
  private cardExpiry;
  private cardCvc;
  private cardValidationErrors = {
    cardNumber: {
      empty: true,
      complete: false,
      message: ""
    },
    cardExpiry: {
      empty: true,
      complete: false,
      message: ""
    },
    cardCvc: {
      empty: true,
      complete: false,
      message: ""
    }
  };
  private readonly STRIPE_FORM_COMPLETED = 3;
  cardValidity = new Subject<{
    untouched: boolean;
    valid: boolean;
  }>();
  cardData = new Subject<any>();
  cardValid = new Subject<boolean>();

  constructor() {}

  createElements() {
    setTimeout(() => {
      this.cardNumber = this.elements.create("cardNumber", {
        style: this.style
      });
      this.cardExpiry = this.elements.create("cardExpiry", {
        style: this.style
      });
      this.cardCvc = this.elements.create("cardCvc", { style: this.style });

      this.mount();
    }, 0);
  }

  unmount() {
    this.cardNumber.unmount();
    this.cardExpiry.unmount();
    this.cardCvc.unmount();
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
    this.cardNumber = null;
    this.cardExpiry = null;
    this.cardCvc = null;
  }

  clear() {
    this.cardNumber.clear();
    this.cardExpiry.clear();
    this.cardCvc.clear();
  }

  async create(name) {
    return await (<any>window).stripe.createToken(this.cardNumber, name);
  }

  checkCardValidity() {
    let Empty = 0;
    let Complete = 0;

    Object.values(this.cardValidationErrors).forEach(({ empty, complete }) => {
      if (empty) Empty++;
      if (complete) Complete++;
    });

    this.cardValidity.next({
      //setting untouched value if all stripe elements are empty
      untouched: Empty === this.STRIPE_FORM_COMPLETED,
      // stripe form is valid if all inputs are empty and not complete ||
      // all inputs empty and completed.
      // First part is needed for profile credit card update because it is not required so I can disable credit card validation if its valid
      valid:
        (Empty === 0 && Complete === this.STRIPE_FORM_COMPLETED) ||
        (Empty === this.STRIPE_FORM_COMPLETED && Complete === 0)
    });

    this.cardData.next({
      ...this.cardValidationErrors,
      valid: Empty === 0 && Complete === this.STRIPE_FORM_COMPLETED
    });
  }

  private mount() {
    this.cardNumber.mount("#cardNumber");
    this.cardExpiry.mount("#cardExpiry");
    this.cardCvc.mount("#cardCvc");

    this.cardNumber.on("change", event => {
      this.addValidation(event);
    });

    this.cardCvc.on("change", event => {
      this.addValidation(event);
    });

    this.cardExpiry.on("change", event => {
      this.addValidation(event);
    });
  }

  private addValidation({ elementType, empty, complete, error }) {
    // Stripe returns element type e.g. CardElement, empty if elementType is empty
    // complete if not empty and valid card number

    this.cardValidationErrors[elementType] = {
      empty,
      complete,
      message: error ? error.message : ""
    };
    this.checkCardValidity();
  }
}
