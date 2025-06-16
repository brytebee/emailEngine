import React, { useState } from "react";

// Card Components
export const Card = ({ children, className = "" }: any) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className = "" }: any) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = "" }: any) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = "" }: any) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

export const CardDescription = ({ children, className = "" }: any) => (
  <p className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>
    {children}
  </p>
);

// Button Component
export const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "default",
  size = "default",
  className = "",
}: any) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline:
      "border border-gray-300 bg-transparent hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    icon: "p-2",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      // @ts-ignore
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = ({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
  id,
  disabled = false,
  onKeyPress,
}: any) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    onKeyPress={onKeyPress}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${className}`}
  />
);

// Textarea Component
export const Textarea = ({
  value,
  onChange,
  placeholder,
  rows = 4,
  className = "",
  id,
}: any) => (
  <textarea
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none ${className}`}
  />
);

// Select Component
export const Select = ({ children, value, onValueChange }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-left bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {value || "Select an option"}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onClick: () => {
                onValueChange(child.props.value);
                setIsOpen(false);
              },
            })
          )}
        </div>
      )}
    </div>
  );
};

export const SelectItem = ({ children, value, onClick }: any) => (
  <div
    onClick={onClick}
    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
  >
    {children}
  </div>
);

// Label Component
export const Label = ({ children, htmlFor, className = "" }: any) => (
  <label
    htmlFor={htmlFor}
    className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${className}`}
  >
    {children}
  </label>
);

// Badge Component
export const Badge = ({
  children,
  variant = "default",
  className = "",
}: any) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    secondary: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  };

  return (
    <span
      // @ts-ignore
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
