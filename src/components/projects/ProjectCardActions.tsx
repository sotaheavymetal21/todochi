"use client";

import { useState } from "react";
import { PencilIcon, TrashIcon } from "@/components/icons";
import EditProjectModal from "@/components/projects/EditProjectModal";
import DeleteConfirmDialog from "@/components/projects/DeleteConfirmDialog";
import type { Project } from "@/types";

interface ProjectCardActionsProps {
  project: Project;
}

export default function ProjectCardActions({
  project,
}: ProjectCardActionsProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="flex gap-1">
        <button
          onClick={() => setShowEditModal(true)}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="プロジェクトを編集"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
          aria-label="プロジェクトを削除"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

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
        />
      )}
    </>
  );
}
