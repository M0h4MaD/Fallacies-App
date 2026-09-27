// frontend/src/components/BrandMark.tsx (ملف جديد)
export default function BrandMark({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="3" />
      <path d="M13 20 L17 15 L21 23 L25 13 L29 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="30" y1="30" x2="42" y2="42" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}