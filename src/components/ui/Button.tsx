import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-accent-600 to-accent-500 text-white
    hover:from-accent-500 hover:to-accent-400
    active:from-accent-700 active:to-accent-600
    shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40
    border border-accent-400/20
  `,
  secondary: `
    bg-midnight-800 text-midnight-100
    hover:bg-midnight-700
    active:bg-midnight-800
    border border-midnight-600/50
  `,
  danger: `
    bg-gradient-to-r from-rose-600 to-rose-500 text-white
    hover:from-rose-500 hover:to-rose-400
    active:from-rose-700 active:to-rose-600
    shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40
    border border-rose-400/20
  `,
  ghost: `
    text-midnight-300 bg-transparent
    hover:bg-midnight-800/50 hover:text-midnight-100
    active:bg-midnight-800
  `,
  outline: `
    bg-transparent text-accent-400
    border border-accent-500/50
    hover:bg-accent-500/10 hover:border-accent-400
    active:bg-accent-500/20
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center
      font-semibold rounded-lg
      transition-all duration-200 ease-smooth
      focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-midnight-900
      disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
      transform active:scale-[0.98]
    `;

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
