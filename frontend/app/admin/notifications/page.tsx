import React from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { NotificationsClient } from "./NotificationsClient";

export const metadata = {
  title: "Notifications | Admin | Talent Flow ATS",
};

export default function NotificationsPage() {
  return (
    <PageContainer animate>
      <NotificationsClient />
    </PageContainer>
  );
}
