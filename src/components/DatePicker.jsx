function DatePicker({ value, onChange }) {
  return (
    <label className="date-picker">
      Travel Date

      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export default DatePicker;