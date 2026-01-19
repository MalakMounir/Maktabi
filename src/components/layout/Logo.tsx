import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  textColor?: string;
}

const Logo = ({ className = "", showText = true, size = "md", textColor = "#1E3A5F" }: LogoProps) => {
  const sizeClasses = {
    sm: { icon: "w-8 h-8", text: "text-lg" },
    md: { icon: "w-10 h-10", text: "text-xl" },
    lg: { icon: "w-12 h-12", text: "text-2xl" },
  };

  const currentSize = sizeClasses[size];

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon - Four orange shapes with rounded inner corners creating a cross */}
      <svg
        width={size === "sm" ? 32 : size === "md" ? 40 : 48}
        height={size === "sm" ? 32 : size === "md" ? 40 : 48}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={currentSize.icon}
      >
        {/* Top-left quadrant - sharp outer corners, rounded inner corner (bottom-right) */}
        <path
          d="M0 0 L20 0 L20 20 Q20 20 18 20 Q16 20 16 18 Q16 16 0 16 Z"
          fill="#FF6B35"
        />
        {/* Top-right quadrant - sharp outer corners, rounded inner corner (bottom-left) */}
        <path
          d="M20 0 L40 0 L40 16 L24 16 Q24 18 Q24 20 22 20 Q20 20 20 20 L20 0 Z"
          fill="#FF6B35"
        />
        {/* Bottom-left quadrant - sharp outer corners, rounded inner corner (top-right) */}
        <path
          d="M0 20 L16 20 Q16 22 Q16 24 18 24 Q20 24 20 24 L20 40 L0 40 Z"
          fill="#FF6B35"
        />
        {/* Bottom-right quadrant - sharp outer corners, rounded inner corner (top-left) */}
        <path
          d="M20 20 Q22 20 Q24 20 Q24 22 Q24 24 L40 24 L40 40 L20 40 Z"
          fill="#FF6B35"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span 
            className={`${currentSize.text} font-bold`} 
            style={{ fontFamily: "'Cairo', sans-serif", color: textColor }}
          >
            مكتبي
          </span>
          <span 
            className={`${currentSize.text === "text-lg" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"} font-medium`} 
            style={{ fontFamily: "'Inter', sans-serif", color: textColor }}
          >
            maktabi
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
