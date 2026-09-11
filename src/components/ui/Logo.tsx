import { LucideProps } from "lucide-react";

export const Logo = ({
  className = "w-8 h-8",
  ...props
}: { className?: string } & any) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Best Pro Digital Geometric Logo"
    {...props}
  >
    {/* Geometric 'B' Reconstructed from User Image */}
    {/* Left Side Facets */}
    <path d="M20 13V50L34 50L20 13Z" fill="#DFFF00" fillOpacity="0.9" />
    <path d="M20 87V50L34 50L20 87Z" fill="#B8D200" />
    <path d="M20 13L34 50L20 87H18V13H20Z" fill="#8A9D00" /> {/* Spine */}
    {/* Top Loop Facets */}
    <path d="M20 13L60 13L79 22L47 36L20 13Z" fill="#EDFF66" />
    <path d="M79 22L79 45L61 50L47 36L79 22Z" fill="#DFFF00" />
    <path d="M60 13L79 22L60 28L60 13Z" fill="#B8D200" />
    {/* Bottom Loop Facets */}
    <path d="M20 87L60 87L79 78L47 64L20 87Z" fill="#B8D200" />
    <path d="M79 78L79 55L61 50L47 64L79 78Z" fill="#8A9D00" />
    <path d="M60 87L79 78L60 72L60 87Z" fill="#6A7A00" />
    {/* Central Diamond (The Core) */}
    <path
      d="M34 50L47 36L61 50L47 64L34 50Z"
      fill="#FFFFFF"
      fillOpacity="0.9"
    />
    <path d="M47 36L61 50L47 64V36Z" fill="#F0F0F0" />
    {/* Connecting Highlights */}
    <path d="M34 50L47 36L20 13L34 50Z" fill="white" fillOpacity="0.05" />
    <path d="M34 50L47 64L20 87L34 50Z" fill="black" fillOpacity="0.05" />
  </svg>
);
