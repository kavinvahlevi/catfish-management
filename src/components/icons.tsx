import type { SVGProps } from "react";

export function FishIcon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6.5 12c.9-2.4 2.3-4.1 4.5-5.1.7-.3 1.5-.3 2.2.1.9.4 1.7 1.3 2.1 2.3.4 1 .4 2.2-.1 3.2-1.2 2.4-3.2 4.1-5.7 4.5-.7.1-1.5.1-2.2-.2-1-.4-1.8-1.3-2.1-2.4-.5-1-.4-2.2 0-3.2z" />
        <path d="m18 16 2.5-2.5L18 11" />
        <path d="M7 12a1 1 0 1 0-2 0 1 1 0 0 0 2 0z" />
      </svg>
    )
  }
  