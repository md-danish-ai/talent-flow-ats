import React from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { getUserDetailsById } from "@lib/api/user-details";
import { cookies } from "next/headers";
import { UserForm } from "@features/user-details/UserForm";
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
        <Link href="/admin/user-management">
          <Button variant="ghost" size="sm" startIcon={<ArrowLeft size={16} />}>
            Back to Users
          </Button>
        </Link>
      </div>

      {!details ? (
        <div className="bg-card rounded-2xl p-12 text-center border ring-1 ring-border">
          <p className="text-muted-foreground">
            User details not found or not submitted yet.
          </p>
        </div>
      ) : (
        <UserForm initialData={details} userId={id} isAdmin={true} />
      )}
    </PageContainer>
  );
}
