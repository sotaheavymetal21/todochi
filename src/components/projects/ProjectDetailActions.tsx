"use client";

import { useState } from "react";
import { PencilIcon, TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui";
import EditProjectModal from "@/components/projects/EditProjectModal";
import DeleteConfirmDialog from "@/components/projects/DeleteConfirmDialog";
import type { Project } from "@/types";

interface ProjectDetailActionsProps {
  project: Project;
}

export default function ProjectDetailActions({
  project,
}: ProjectDetailActionsProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowEditModal(true)}
        className="flex items-center gap-1.5"
      >
        <PencilIcon className="h-4 w-4" />
        編集
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDeleteDialog(true)}
        className="flex items-center gap-1.5 text-red-500 hover:text-red-700"
      >
        <TrashIcon className="h-4 w-4" />
        削除
      </Button>

      {showEditModal && (
        <EditProjectModal
          project={project}
          onClose={() => setShowEditModal(false)}
        />
      )}
      {showDeleteDialog && (
        <DeleteConfirmDialog
          project={project}
          onClose={() => setShowDeleteDialog(false)}
          redirectOnSuccess
        />
      )}
    </>
  );
}
