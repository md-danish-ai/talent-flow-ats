"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { Select } from "@components/ui-elements/Select";
import { UserListResponse } from "@lib/api/auth";
import { papersApi, PaperSetup } from "@lib/api/papers";
import { departmentsApi, Department } from "@lib/api/departments";
import { TEST_LEVELS } from "@lib/validations/auth";
import { toast } from "@lib/toast";
import { Loader2, User, Phone, Mail, BookOpen, Layers, Briefcase } from "lucide-react";
import { api } from "@lib/api/index";

interface AssignPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserListResponse;
}

export const AssignPaperModal: React.FC<AssignPaperModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  console.log("User data in AssignPaperModal:", user);
  const userLevel = user.testlevel || (user as any).testLevel || (user as any).test_level;
  const testLevelId = user.testlevel_id?.toString();
  
  const [papers, setPapers] = useState<PaperSetup[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedPaper, setSelectedPaper] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && selectedDepartment && testLevelId) {
      fetchPapers();
    } else if (isOpen && !selectedDepartment) {
      setPapers([]);
      setSelectedPaper("");
    }
  }, [isOpen, selectedDepartment, testLevelId]);

  const fetchDepartments = async () => {
    try {
      const response = await departmentsApi.getDepartments({ is_active: true, limit: 100 });
      setDepartments(response.data || []);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      toast.error("Failed to fetch departments");
    }
  };

  const fetchPapers = async () => {
    if (!selectedDepartment || !testLevelId) return;
    
    setIsLoading(true);
    try {
      const response = await papersApi.getPapers({ 
        is_active: true, 
        limit: 100,
        department_id: selectedDepartment,
        test_level_id: testLevelId,
      });
      setPapers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch papers:", error);
      toast.error("Failed to fetch paper sets");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedPaper) {
      toast.error("Please select a paper set");
      return;
    }

    setIsSubmitting(true);
    try {
      // Assuming we update the user's testlevel. 
      // I'll use a generic put request for now as there's no specific API in auth.ts yet.
      // We might need to add a backend route for this.
      await api.put(`/auth/update-paper/${user.id}`, { testlevel: selectedPaper });

      toast.success("Paper set assigned successfully");
      onClose();
    } catch (error) {
      console.error("Failed to assign paper:", error);
      toast.error("Failed to assign paper set. Please ensure the backend route exists.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Paper Set"
      className="max-w-md"
    >
      <div className="space-y-6">
        {/* User Details Section */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <User size={20} />
              </div>
              <div>
                <Typography variant="body3" weight="semibold">
                  {user.username}
                </Typography>
                <Typography variant="body4" color="text-muted-foreground">
                  User ID: #{user.id}
                </Typography>
              </div>
            </div>
            {userLevel && (
              <div className="px-2.5 py-1 rounded-lg bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                <Typography variant="body4" weight="bold" className="uppercase tracking-wider">
                  {userLevel}
                </Typography>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone size={14} />
              <Typography variant="body4">{user.mobile}</Typography>
            </div>
            {user.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail size={14} />
                <Typography variant="body4" className="truncate text-xs">{user.email}</Typography>
              </div>
            )}
          </div>
        </div>

        {/* Selection Controls Section */}
        <div className="space-y-5">
          {/* Department Selection */}
          <div className="space-y-2">
            <Typography variant="body4" weight="medium" className="flex items-center gap-2 text-foreground/80">
              <Layers size={16} className="text-brand-primary" /> Select Department
            </Typography>
            <Select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              disabled={isSubmitting}
              className="w-full"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Paper Set Selection */}
          <div className="space-y-2 border-t border-border/50 pt-5">
            <div className="flex items-center justify-between">
              <Typography variant="body4" weight="medium" className="flex items-center gap-2 text-foreground/80">
                <BookOpen size={16} className="text-brand-primary" /> Select Paper Set
              </Typography>
              <Typography variant="body4" className="text-xs text-muted-foreground">
                Showing {userLevel || 'all'} levels
              </Typography>
            </div>
            
            <Select
              value={selectedPaper}
              onChange={(e) => setSelectedPaper(e.target.value)}
              disabled={isLoading || isSubmitting}
              className="w-full"
            >
              <option value="">Choose a paper set...</option>
              {papers.length > 0 ? (
                papers.map((paper) => (
                  <option key={paper.id} value={paper.paper_name}>
                    {paper.paper_name} ({paper.total_marks} Marks)
                  </option>
                ))
              ) : (
                <option value="" disabled>No papers available for this selection</option>
              )}
            </Select>
            
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs pl-1">
                <Loader2 size={12} className="animate-spin" />
                Updating papers...
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1 font-bold"
            onClick={handleAssign}
            disabled={!selectedPaper || isLoading || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Assigning...
              </>
            ) : (
              "Assign Paper"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AssignPaperModal;
