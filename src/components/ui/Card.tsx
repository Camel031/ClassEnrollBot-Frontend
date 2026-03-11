import { HTMLAttributes, forwardRef } from "react";

type CardVariant = "default" | "glass" | "elevated" | "outline";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
  glowOnHover?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-midnight-900/80 border border-midnight-700/50",
  glass: "glass",
  elevated: "bg-midnight-900 border border-midnight-700/50 shadow-elevated",
  outline: "bg-transparent border border-midnight-700/50",
};

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className = "",
      variant = "default",
      padding = "md",
      hoverable = false,
      glowOnHover = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = "rounded-xl backdrop-blur-sm";

    const hoverStyles = hoverable
      ? "transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:border-midnight-600/70"
      : "";

    const glowStyles = glowOnHover
      ? "card-glow hover:shadow-glow-sm"
      : "";

    return (
      <div
        ref={ref}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${hoverStyles}
          ${glowStyles}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;

// Additional card subcomponents for consistent styling
export function CardHeader({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`pb-4 mb-4 border-b border-midnight-700/50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-lg font-semibold text-midnight-100 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-midnight-400 mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`pt-4 mt-4 border-t border-midnight-700/50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
