import React from "react";
import { Container } from "./Container";
import { Typography } from "@components/ui-elements/Typography";
import { Logo } from "@components/ui-elements/Logo";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Logo size="sm" />
          <Typography variant="body5">
            © {new Date().getFullYear()} Arcgate. All rights reserved.
          </Typography>
          <div className="flex gap-6">
            <Typography
              variant="body5"
              as="a"
              className="hover:text-[var(--color-brand-primary)]"
            >
              Privacy Policy
            </Typography>
            <Typography
              variant="body5"
              as="a"
              className="hover:text-[var(--color-brand-primary)]"
            >
              Terms of Service
            </Typography>
          </div>
        </div>
      </Container>
    </footer>
  );
};
