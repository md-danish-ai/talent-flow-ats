import { redirect } from "next/navigation";
import { getCurrentUser } from "@lib/auth/get-current-user";
import { UserForm } from "@features/user-details/UserForm";

export default async function PersonalDetailsPage() {
  const user = await getCurrentUser();

  // Only regular users (role: 'user') can access this page
  if (!user || user.role !== "user") {
    redirect("/admin/management/users");
  }

  return (
    <div className="min-h-screen bg-layout-bg px-4 md:px-12">
      <UserForm />
    </div>
  );
}
