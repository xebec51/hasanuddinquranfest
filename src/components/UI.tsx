import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
export function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      <span className="sr-only"> (buka tab baru)</span>
    </a>
  );
}
export function ActionLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <ExternalLink
      href={href}
      className={`button ${secondary ? "button-outline" : "button-primary"}`}
    >
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </ExternalLink>
  );
}
export function SectionHeading({
  label,
  title,
  children,
}: {
  label?: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      {label && (
        <p className="eyebrow">
          <span />
          {label}
        </p>
      )}
      <h2>{title}</h2>
      {children && <p className="section-description">{children}</p>}
    </div>
  );
}
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth=".8">
        <circle cx="200" cy="200" r="184" />
        <circle cx="200" cy="200" r="137" />
        <path d="M200 16 330 70 384 200 330 330 200 384 70 330 16 200 70 70Z" />
        <path d="M200 42 247 153 358 200 247 247 200 358 153 247 42 200 153 153Z" />
        <path d="M88 88 200 133 312 88 267 200 312 312 200 267 88 312 133 200Z" />
        <path d="M200 63 337 200 200 337 63 200Z" />
        <path d="M103 103H297V297H103Z" />
      </g>
    </svg>
  );
}
