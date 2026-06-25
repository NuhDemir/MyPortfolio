const QuickSummary = ({ summaryLines }) => {
  return (
    <div className="db-section db-section--alt">
      <div className="db-section__header">
        <h2>Ozet</h2>
      </div>

      <ul className="db-summary">
        {summaryLines.map(({ id, label, value }) => (
          <li key={id}>
            <span className="db-summary__label">{label}</span>
            <span className="db-summary__value">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuickSummary;
