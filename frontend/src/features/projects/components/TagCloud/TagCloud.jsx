import "./TagCloud.css";

const TagCloud = ({ tags, selectedTags, onToggle }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="tcloud" aria-label="Etiket bulutu">
      <div className="tcloud__scroll">
        {tags.map(({ name, count }) => {
          const active = selectedTags.includes(name);
          return (
            <button
              key={name}
              type="button"
              className={`tcloud__chip ${active ? "tcloud__chip--active" : ""}`}
              onClick={() => onToggle(name)}
            >
              {name}
              <span className="tcloud__count">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TagCloud;
