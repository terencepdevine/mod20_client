import React from "react";
import { CalendarDaysIcon } from "@heroicons/react/16/solid";

import "./FormDate.scss";

interface FormDateProps {
  label: string;
  date: string | Date | null | undefined;
}

export const FormDate: React.FC<FormDateProps> = ({ label, date }) => {
  const formatDate = (dateValue: string | Date | null | undefined): string => {
    if (!dateValue) return "Unknown";

    try {
      return new Date(dateValue).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="form-date">
      <CalendarDaysIcon className="w-4 h-4" />
      <p>
        {label}: {formatDate(date)}
      </p>
    </div>
  );
};
