
import { SVGProps } from "react";

export function PayPalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 11l3-9h5c3 0 3.5 1.5 3 4s-2 4-5 4H9.7" />
      <path d="M10.2 22H4.8c-.4 0-.8-.3-.9-.7L2.2 13c-.1-.2 0-.4.2-.5.1-.1.3-.2.4-.2" />
      <path d="M18 7c2.5 0 3.5 1.5 3 4s-2 4-5 4h-4l-1 3" />
    </svg>
  );
}
