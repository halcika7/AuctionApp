import { Subject } from "rxjs";
import { Injectable, NgZone } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class StripeServiceService {
  constructor(private _zone: NgZone) {}

  async create(name, number, exp_month, exp_year, cvc): Promise<{ error?:any, id?:any }> {
    return new Promise((resolve, reject) => {
      (<any>window).Stripe.card.createToken(
        {
          number,
          exp_month,
          exp_year,
          cvc,
          name
        },
        (status: number, response: any) => {
          return resolve(response);
        }
      );
    });
  }
}
