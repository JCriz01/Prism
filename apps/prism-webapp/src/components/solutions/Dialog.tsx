"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  locked?: boolean;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  locked,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const DURATION = 200;
  const panelRef = useRef<HTMLDivElement>(null);

  // Mount only on client
  useEffect(() => {
    setPortalTarget(document.body);
    setMounted(true);
  }, []);

  // Animate in/out when open changes
  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), DURATION);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Lock body scroll when modal visible
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open || locked) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, locked, onClose]);

  if (!mounted || !portalTarget || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] grid place-items-center"
      onMouseDown={() => {
        if (!locked) onClose();
      }}
    >
      {/* Overlay */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Panel */}
      <div
        onMouseDown={(e) => e.stopPropagation()}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        tabIndex={-1}
        className={clsx(
          "relative w-[min(450px,calc(100%-2rem))] rounded-2xl border bg-white p-6 shadow-xl outline-none dark:bg-neutral-900 dark:text-white transition-all duration-200",
          visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-2 scale-95"
        )}
      >
        {title && (
          <h2
            id="modal-title"
            className="mb-3 text-center text-xl font-semibold text-neutral-900 dark:text-white"
          >
            {title}
          </h2>
        )}

        {children}

        {!locked && (
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="absolute right-4 top-4 rounded p-1 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-neutral-800"
          >
            ✕
          </button>
        )}
      </div>
    </div>,
    portalTarget
  );
}
