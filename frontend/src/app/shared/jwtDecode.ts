import * as jwt from "jwt-decode";

export function jwtDecode(token) {
  try {
    return jwt(token);
  } catch (error) {
    return {};
  }
}
