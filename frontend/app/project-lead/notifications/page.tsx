import React from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { NotificationsClient } from "../../admin/notifications/NotificationsClient";

export const metadata = {
  title: "Notifications | Project Lead | Talent Flow ATS",
};

export default function NotificationsPage() {
  return (
    <PageContainer animate>
      <NotificationsClient />
    </PageContainer>
  );
}
