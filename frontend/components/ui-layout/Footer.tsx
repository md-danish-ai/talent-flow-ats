import React from "react";
import { Container } from "./Container";
import { Typography } from "@components/ui-elements/Typography";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[var(--color-brand-primary)] rounded flex items-center justify-center text-white font-bold text-xs">
              A
            </div>
            <Typography variant="body4" weight="bold" color="text-slate-900">
              ArcInterview
            </Typography>
          </div>
          <Typography variant="body5">
            © {new Date().getFullYear()} Arcgate. All rights reserved.
          </Typography>
          <div className="flex gap-6">
            <Typography variant="body5" as="a" className="hover:text-[var(--color-brand-primary)]">
              Privacy Policy
            </Typography>
            <Typography variant="body5" as="a" className="hover:text-[var(--color-brand-primary)]">
              Terms of Service
            </Typography>
          </div>
        </div>
      </Container>
    </footer>
  );
};
