const InputForm = ({
  type = "text",
  placeholder = "Enter value",
  label = "",
  icon = null,
  value = "",
  onChange = () => {},
  onBlur = () => {},
  required = false,
  disabled = false,
  className = "",
  error = "",
  name = "",
}) => {
  return (
    <div className="auth-field">
      {label && (
        <div className="auth-label">
          {icon && <span className="auth-label-icon">{icon}</span>}
          <span>{label}</span>
        </div>
      )}

      <input
        type={type}
        className={`auth-input ${error ? "auth-input--error" : ""} ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        name={name}
      />

      {error && <span className="auth-error">{error}</span>}
    </div>
  );
};

export default InputForm;
