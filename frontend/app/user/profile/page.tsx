import { ProfileClient } from "@components/features/profile/ProfileClient";
import { getCurrentUser } from "@lib/auth/get-current-user";
import { getUserDetailsById } from "@lib/api/user-details";
import { cookies } from "next/headers";

export default async function UserProfilePage() {
  const user = await getCurrentUser();
  const cookieStore = await cookies();

  let userDetails = null;

  if (user) {
    const cookieString = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join(";");

    try {
      userDetails = await getUserDetailsById(user.id, {
        cookies: cookieString,
      });
    } catch (error) {
      console.warn("Could not fetch user recruitment details:", error);
    }
  }

  return <ProfileClient user={user} userDetails={userDetails} />;
}
