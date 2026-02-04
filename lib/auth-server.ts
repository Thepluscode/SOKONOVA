
import { auth } from "@/auth";

export function getSession() {
  return auth();
}
