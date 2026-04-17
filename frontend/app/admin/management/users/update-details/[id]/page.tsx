import React from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { getUserDetailsById } from "@lib/api/user-details";
import { cookies } from "next/headers";
import { UserForm } from "@features/user-details/UserForm";
import { UpdateAccountInfoForm } from "@features/user-details/UpdateAccountInfoForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@components/ui-elements/Button";

interface UpdateUserDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateUserDetailsPage({
  params,
}: UpdateUserDetailsProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join(";");

  let details = null;
  try {
    details = await getUserDetailsById(id, { cookies: cookieString });
  } catch (error) {
    console.error(`Failed to fetch user details for ID ${id}:`, error);
  }

  return (
    <PageContainer animate>
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/management/users">
          <Button variant="ghost" size="sm" startIcon={<ArrowLeft size={16} />}>
            Back to Users
          </Button>
        </Link>
      </div>

      <UpdateAccountInfoForm
        userId={id}
        initialData={{
          username: details?.username,
          mobile: details?.mobile,
          email: details?.email,
          testlevel: details?.testlevel,
          department_id: details?.department_id,
        }}
      />

      {details && details.personalDetails ? (
        <UserForm initialData={details} userId={id} isAdmin={true} />
      ) : (
        <div className="bg-card rounded-2xl p-12 text-center border ring-1 ring-border mt-6">
          <p className="text-muted-foreground uppercase tracking-wider font-bold text-sm">
            Recruitment details not submitted yet.
          </p>
        </div>
      )}
    </PageContainer>
  );
}
