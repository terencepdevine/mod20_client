import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import "./Tooltip.scss";

export type TooltipPosition =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end";
export type TooltipTrigger = "hover" | "click" | "focus" | "manual";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: TooltipPosition;
  trigger?: TooltipTrigger;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  disabled?: boolean;
  delay?: number;
  className?: string;
  contentClassName?: string;
  offset?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = "top",
  trigger = "hover",
  isOpen: controlledIsOpen,
  onOpenChange,
  disabled = false,
  delay = 200,
  className = "",
  contentClassName = "",
  offset = 8,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({
    position: "fixed",
    top: -9999,
    left: -9999,
    zIndex: 9999,
  });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Use controlled state if provided, otherwise use internal state
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(open);
    }
    onOpenChange?.(open);
  };

  // Calculate tooltip position
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case "top-start":
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left;
        break;
      case "top-end":
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.right - tooltipRect.width;
        break;
      case "bottom":
        top = triggerRect.bottom + offset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case "bottom-start":
        top = triggerRect.bottom + offset;
        left = triggerRect.left;
        break;
      case "bottom-end":
        top = triggerRect.bottom + offset;
        left = triggerRect.right - tooltipRect.width;
        break;
      case "left":
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - offset;
        break;
      case "right":
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + offset;
        break;
    }

    // Keep tooltip within viewport bounds
    if (left < 0) left = 8;
    if (left + tooltipRect.width > viewport.width)
      left = viewport.width - tooltipRect.width - 8;
    if (top < 0) top = 8;
    if (top + tooltipRect.height > viewport.height)
      top = viewport.height - tooltipRect.height - 8;

    setTooltipStyle({
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 9999,
    });
  };

  // Handle show/hide with delay
  const showTooltip = () => {
    if (disabled || trigger === "manual") return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => setIsOpen(true), delay);
    } else {
      setIsOpen(true);
    }
  };

  const hideTooltip = () => {
    if (disabled || trigger === "manual") return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsOpen(false);
  };

  const toggleTooltip = () => {
    if (disabled || trigger === "manual") return;
    setIsOpen(!isOpen);
  };

  // Event handlers based on trigger type
  const getTriggerProps = () => {
    const props: any = {};

    if (trigger === "hover") {
      props.onMouseEnter = showTooltip;
      props.onMouseLeave = hideTooltip;
    } else if (trigger === "click") {
      props.onClick = toggleTooltip;
    } else if (trigger === "focus") {
      props.onFocus = showTooltip;
      props.onBlur = hideTooltip;
      props.tabIndex = 0;
    }

    return props;
  };

  // Position tooltip after it's rendered
  useEffect(() => {
    if (isOpen && tooltipRef.current) {
      calculatePosition();
    }
  }, [isOpen, position, offset]);

  // Handle window resize
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => calculatePosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Handle click outside for click trigger
  useEffect(() => {
    if (!isOpen || trigger !== "click") return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, trigger]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Animation variants
  const tooltipVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: position.includes("top") ? 4 : position.includes("bottom") ? -4 : 0,
      x: position.includes("left") ? 4 : position.includes("right") ? -4 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
    },
  };

  const tooltipContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={tooltipRef}
          className={`tooltip ${contentClassName}`}
          style={tooltipStyle}
          variants={tooltipVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{
            duration: 0.15,
            ease: "easeOut",
          }}
          data-position={position}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div
        ref={triggerRef}
        className={`tooltip-trigger ${className}`}
        {...getTriggerProps()}
      >
        {children}
      </div>
      {typeof document !== "undefined" &&
        createPortal(tooltipContent, document.body)}
    </>
  );
};

export default Tooltip;
