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
  private cardNumber = this.elements.create("cardNumber", {
    style: this.style
  });
  private cardExpiry = this.elements.create("cardExpiry", {
    style: this.style
  });
  private cardCvc = this.elements.create("cardCvc", { style: this.style });
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
  stripeErrors = new Subject<any>();
  cardValidity = new Subject<any>();
  cardData = new Subject<any>();

  constructor() {}

  mount() {
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
    let error = "";
    let Complete = 0;

    Object.values(this.cardValidationErrors).forEach(
      ({ empty, complete, message }) => {
        if (empty) Empty++;
        if (message) {
          error += message;
        }
        if (complete) Complete++;
      }
    );

    this.cardValidity.next({
      untouched: Empty === 3,
      error,
      valid: Empty === 0 && Complete === 3
    });

    this.cardData.next({
      ...this.cardValidationErrors,
      valid: Empty === 0 && Complete === 3
    });
  }

  private addValidation({ elementType, empty, complete, error }) {
    this.cardValidationErrors[elementType] = {
      empty,
      complete,
      message: error ? error.message : ""
    };
    this.stripeErrors.next(error ? error.message : "");
    this.checkCardValidity();
  }
}
