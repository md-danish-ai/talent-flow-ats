import React, { useState } from "react";
import { Button } from "@components/ui-elements/Button";
import { Modal } from "@components/ui-elements/Modal";
import { Input } from "@components/ui-elements/Input";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [subject, setSubject] = useState<string | number | undefined>(
    undefined,
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Question"
      className="max-w-4xl"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectDropdown
            placeholder="Please Select Subject---"
            value={subject}
            onChange={setSubject}
            options={[
              { id: "Industry Awareness", label: "Industry Awareness" },
              { id: "Comprehension", label: "Comprehension" },
            ]}
          />
          <Input type="text" placeholder="Write question here" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
          {["A", "B", "C", "D", "E", "F"].map((opt) => (
            <Input
              key={opt}
              type="text"
              placeholder={`Option ${opt}`}
              endIcon={
                <input
                  type="radio"
                  name="correctOption"
                  className="w-[18px] h-[18px] text-brand-primary border-border focus:ring-brand-primary cursor-pointer accent-brand-primary mr-2"
                />
              }
            />
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" color="primary" shadow animate="scale">
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};
