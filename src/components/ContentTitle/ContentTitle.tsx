import React from "react";
import "./ContentTitle.scss";
import { Link } from "react-router-dom";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import Tooltip from "../Tooltip/Tooltip";

interface ContentTitleProps {
  children: React.ReactNode;
  className?: string;
  systemSlug?: string;
  sectionSlug?: string;
  sectionType?: string;
  onDelete?: () => void;
  isDeleting?: boolean;
  entityName?: string;
  entityType?: string;
}

export const ContentTitle: React.FC<ContentTitleProps> = ({
  children,
  className = "",
  systemSlug,
  sectionSlug,
  sectionType,
  onDelete,
  isDeleting = false,
  entityName,
  entityType = "item",
}) => {
  let linkTo = "";
  let linkLabel = "";

  if (systemSlug && sectionSlug && sectionType) {
    linkTo = `/systems/${systemSlug}/${sectionType}/${sectionSlug}`;
    linkLabel = "View Item";
  } else if (systemSlug) {
    linkTo = `/systems/${systemSlug}`;
    linkLabel = "View System";
  }

  const handleDelete = () => {
    if (!onDelete || !entityName) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the ${entityType} "${entityName}"? This will permanently delete ALL related data. This action cannot be undone.`,
    );

    if (confirmDelete) {
      onDelete();
    }
  };

  const optionsMenu = (
    <div className="content-title__options-menu">
      {onDelete && entityName && (
        <button
          className="content-title__option content-title__option--danger"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <TrashIcon className="w-4 h-4" />
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      )}
    </div>
  );

  return (
    <div className="content-title">
      <h1 className={`content-title__text ${className}`.trim()}>{children}</h1>
      <div className="content-title__links">
        {linkTo && (
          <Link
            to={linkTo}
            className="content-title__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <EyeIcon className="w-4 h-4" />
            {linkLabel}
          </Link>
        )}
        <Tooltip
          content={optionsMenu}
          trigger="click"
          position="bottom-start"
          contentClassName="tooltip--menu"
        >
          <button className="content-title__link">
            <EllipsisVerticalIcon className="w-4 h-4" />
            Options
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ContentTitle;
