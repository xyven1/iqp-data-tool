import { getCurrentUser } from "vuefire";

export async function isAuthorized(): Promise<boolean> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return false;
  const token = await currentUser.getIdTokenResult();
  return token.claims.authorized as boolean;
}
