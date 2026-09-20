"use client";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { CustomCursorLayer } from "../custom-cursor";

const DIALOG_EXIT_MS = 280;

export function Dialog({
  open,
  onClose,
  title,
  children,
  drawer = false,
  side = "right",
  portal = false,
  className = "",
  showHeader = true,
  closeImmediately = false,
  onExited,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  drawer?: boolean;
  side?: "left" | "right";
  portal?: boolean;
  className?: string;
  showHeader?: boolean;
  closeImmediately?: boolean;
  onExited?: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [rendered, setRendered] = useState(open);
  const [closing, setClosing] = useState(false);
  const previousFocus = useRef<HTMLElement | null>(null);
  const previousOverflow = useRef("");
  const previousPaddingRight = useRef("");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onExitedRef = useRef(onExited);
  useEffect(() => {
    onExitedRef.current = onExited;
  }, [onExited]);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (open) {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setRendered(true);
        setClosing(false);
      } else if (rendered) {
        if (closeImmediately) {
          setRendered(false);
          setClosing(false);
          onExitedRef.current?.();
        } else {
          setClosing(true);
        }
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [closeImmediately, open, rendered]);
  useEffect(() => {
    if (open && !rendered && !previousFocus.current) {
      previousFocus.current = document.activeElement as HTMLElement | null;
    }
  }, [open, rendered]);
  useEffect(() => {
    if (!closing) return;
    closeTimer.current = setTimeout(() => {
      setRendered(false);
      setClosing(false);
      onExitedRef.current?.();
    }, DIALOG_EXIT_MS);
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, [closing]);
  useEffect(() => {
    const dialog = ref.current;
    if (!rendered) {
      if (dialog?.open) dialog.close();
      document.body.style.overflow = previousOverflow.current;
      document.body.style.paddingRight = previousPaddingRight.current;
      previousFocus.current?.focus();
      previousFocus.current = null;
      return;
    }
    if (!dialog) return;
    if (!dialog.open) {
      previousFocus.current ??= document.activeElement as HTMLElement | null;
      previousOverflow.current = document.body.style.overflow;
      previousPaddingRight.current = document.body.style.paddingRight;
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      dialog.showModal();
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }
  }, [rendered]);
  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (ref.current?.open) ref.current.close();
      document.body.style.overflow = previousOverflow.current;
      document.body.style.paddingRight = previousPaddingRight.current;
    },
    [],
  );
  const requestClose = () => {
    if (!open || closing) return;
    setClosing(true);
    onClose();
  };
  const dialog = (
    <dialog
      ref={ref}
      className={`dialog ${drawer ? `dialog-drawer dialog-drawer-${side}` : ""} ${closing ? "is-closing" : ""} ${className}`.trim()}
      aria-labelledby={id}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <CustomCursorLayer />
      <div className="dialog-inner">
        {showHeader ? (
          <div className="dialog-heading">
            <h2 id={id}>{title}</h2>
            <button
              className="icon-button"
              aria-label={`Close ${title}`}
              onClick={requestClose}
            >
              <X size={22} />
            </button>
          </div>
        ) : (
          <h2 id={id} className="sr-only">
            {title}
          </h2>
        )}
        {children}
      </div>
    </dialog>
  );
  if (!rendered) return null;
  return portal && mounted ? createPortal(dialog, document.body) : dialog;
}
