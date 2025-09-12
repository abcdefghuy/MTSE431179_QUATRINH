import React from "react";
import "./Input.css";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  required = false,
  className = "",
  ...props
}) => {
  const inputClass = `input ${error ? "input--error" : ""} ${
    disabled ? "input--disabled" : ""
  } ${className}`.trim();

  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClass}
        {...props}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Input;
