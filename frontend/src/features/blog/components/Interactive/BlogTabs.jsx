import React, { useState, memo } from "react";
import "./BlogTabs.css";

const BlogTabs = memo(({ tabsData }) => {
  const parsed = (() => {
    try {
      return typeof tabsData === "string" ? JSON.parse(tabsData) : tabsData;
    } catch {
      return null;
    }
  })();

  const [activeIndex, setActiveIndex] = useState(0);

  if (!parsed || !Array.isArray(parsed.tabs) || parsed.tabs.length === 0) {
    return (
      <div className="btabs-error">
        Gecersiz sekme verisi. tabs array zorunludur: [{`{"label":"Sekme 1","content":"Icerik 1"}`}]
      </div>
    );
  }

  const { tabs, title } = parsed;
  const activeTab = tabs[activeIndex] || tabs[0];

  return (
    <div className="btabs-wrap">
      {title && <div className="btabs-heading">{title}</div>}
      <div className="btabs-nav" role="tablist">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            role="tab"
            aria-selected={activeIndex === idx}
            aria-controls={`btab-panel-${idx}`}
            id={`btab-${idx}`}
            className={`btabs-tab ${activeIndex === idx ? "btabs-tab--active" : ""}`}
            onClick={() => setActiveIndex(idx)}
          >
            {tab.icon && <span className="btabs-tab__icon">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className="btabs-panel"
        role="tabpanel"
        id={`btab-panel-${activeIndex}`}
        aria-labelledby={`btab-${activeIndex}`}
      >
        {activeTab.language ? (
          <pre className="btabs-code"><code>{activeTab.content}</code></pre>
        ) : (
          <div className="btabs-text">{activeTab.content}</div>
        )}
      </div>
    </div>
  );
});

BlogTabs.displayName = "BlogTabs";
export default BlogTabs;
