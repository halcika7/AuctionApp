import * as jwt from "jwt-decode";

export function jwtDecode(token) {
  try {
    const { id } = jwt(token);
    return id;
  } catch (error) {
    const id = "";
    return id;
  }
}
