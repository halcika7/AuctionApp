import { Action } from "@ngrx/store";

export const CHECK_USER_VALIDITY = "CHECK_USER_VALIDITY";
export const MAKE_PAYMENT = "MAKE_PAYMENT";

export const PAYMENT_PAGE_SUCCESS = "PAYMENT_PAGE_SUCCESS";
export const PAYMENT_PAGE_FAILED = "PAYMENT_PAGE_FAILED";

export const CLEAR_PAYMENT_MESSAGES = "CLEAR_PAYMENT_MESSAGES";

export class CheckUserValidity implements Action {
  readonly type = CHECK_USER_VALIDITY;
  constructor(public data: { productId: string; subcategoryId: string }) {}
}

export class PaymentPageSuccess implements Action {
  readonly type = PAYMENT_PAGE_SUCCESS;
  constructor(public message?: string) {}
}

export class PaymentPageFailed implements Action {
  readonly type = PAYMENT_PAGE_FAILED;
  constructor(
    public payload: {
      message?: string;
      authorizationError?: string;
      accessToken?: string;
      errors?: any;
    }
  ) {}
}

export class MakePayment implements Action {
  readonly type = MAKE_PAYMENT;
  constructor(
    public data: {
      addressInformation: any;
      cardInformation: any;
      userRating: number;
      productId: string;
      subcategoryId: string;
    }
  ) {}
}

export class ClearPaymentMessages implements Action {
  readonly type = CLEAR_PAYMENT_MESSAGES;
  constructor() {}
}

export type PaymentPageActions =
  | CheckUserValidity
  | PaymentPageSuccess
  | PaymentPageFailed
  | MakePayment
  | ClearPaymentMessages;
