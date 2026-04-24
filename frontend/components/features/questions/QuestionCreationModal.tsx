"use client";

import React, { useState } from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Tabs } from "@components/ui-elements/Tabs";
import { AIQuestionForm } from "@components/features/questions/AIQuestionForm";
import { Plus, Sparkles } from "lucide-react";

interface QuestionCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  questionType: string;
  onSuccess: () => void;
  renderManualForm: (onSuccess: () => void) => React.ReactNode;
}

export const QuestionCreationModal: React.FC<QuestionCreationModalProps> = ({
  isOpen,
  onClose,
  title,
  questionType,
  onSuccess,
  renderManualForm,
}) => {
  const [activeTab, setActiveTab] = useState("manual");

  const tabs = [
    { label: "Manual Add", value: "manual", icon: <Plus size={16} /> },
    { label: "AI Generator", value: "ai", icon: <Sparkles size={16} /> },
  ];

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="max-w-5xl"
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
              variant="pills"
              size="md"
              fullWidth
            />
          </div>
        </div>

        <div className="min-h-[400px]">
          {activeTab === "manual" ? (
            renderManualForm(handleSuccess)
          ) : (
            <AIQuestionForm
              defaultQuestionTypeCode={questionType}
              onSuccess={handleSuccess}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};
