const Input = ({ id, type, label, disabled, onChange, value }) => (
  <input
    className="form-group__input my-2"
    type={type}
    id={id}
    placeholder={label}
    disabled={disabled}
    onChange={onChange}
    value={value}
  />
);

export default Input;
