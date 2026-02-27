import { ProfileClient } from "@components/features/profile/ProfileClient";
import { getCurrentUser } from "@lib/auth/get-current-user";

export default async function AdminProfilePage() {
  const user = await getCurrentUser();
  // getCurrentUser already handles 401 redirect if token is expired

  return <ProfileClient user={user} />;
}
