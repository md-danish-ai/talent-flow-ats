"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { ComponentPageView } from "../ComponentPageView";

interface ModalDocsProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const ModalDocs = ({ isOpen, onOpen, onClose }: ModalDocsProps) => (
  <ComponentPageView
    title="Modal"
    description="Centrally located overlay for focused tasks. Features backdrop blur, scale animations, and smooth lifecycle transitions."
    code={`<Modal isOpen={isOpen} onClose={close}>...</Modal>`}
    fullSource={`import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { useState } from "react";

export default function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal Implementation">
        <div className="space-y-4">
          <Typography variant="body3" className="text-muted-foreground">Modals are used for focused user tasks.</Typography>
          <Button onClick={() => setIsOpen(false)} className="w-full">Got it, close</Button>
        </div>
      </Modal>
    </>
  );
}`}
  >
    <Button variant="primary" onClick={onOpen} className="rounded-xl shadow-lg">
      Open Documentation Demo
    </Button>
    <Modal isOpen={isOpen} onClose={onClose} title="Modal Implementation">
      <div className="space-y-4">
        <Typography
          variant="body3"
          className="text-muted-foreground leading-relaxed"
        >
          Modals are used for information that requires the user&apos;s primary
          attention. Ensure close buttons are always accessible.
        </Typography>
        <Button
          variant="outline"
          onClick={onClose}
          className="w-full mt-4 rounded-xl"
        >
          Got it, close
        </Button>
      </div>
    </Modal>
  </ComponentPageView>
);
