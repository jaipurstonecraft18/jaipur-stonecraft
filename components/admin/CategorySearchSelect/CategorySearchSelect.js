"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import styles from "./CategorySearchSelect.module.css";

export default function CategorySearchSelect({
  categories = [],
  value = "",
  onChange,
  label = "Category",
  required = false,
  id = "category-search-select",
  placeholder = "Search or select category...",
  onQuickAdd = null,
  helperText = "",
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  // Find currently selected category object
  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.slug === value || c.id === value || c.name === value) || null;
  }, [categories, value]);

  // Filter categories based on search input
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;

    return categories.filter((cat) => {
      const name = (cat.name || "").toLowerCase();
      const slug = (cat.slug || "").toLowerCase();
      const subcat = (cat.parentSubcategory || cat.parent_subcategory_slug || "").toLowerCase();
      const coll = (cat.parentCollection || cat.parent_collection_slug || "").toLowerCase();

      return (
        name.includes(q) ||
        slug.includes(q) ||
        subcat.includes(q) ||
        coll.includes(q)
      );
    });
  }, [categories, searchQuery]);

  // Reset highlight index when filtered results change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredCategories]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      // Short delay for render
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (category) => {
    if (onChange) {
      onChange(category.slug, category);
    }
    setIsOpen(false);
    setSearchQuery("");
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredCategories.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredCategories[highlightedIndex]) {
          handleSelect(filteredCategories[highlightedIndex]);
        } else if (filteredCategories.length === 1) {
          handleSelect(filteredCategories[0]);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.container} ref={containerRef} onKeyDown={handleKeyDown}>
      {/* Label & Optional +Quick Add Action */}
      <div className={styles.labelRow}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            <span>{label}</span>
            {required && <span className={styles.requiredStar}>*</span>}
          </label>
        )}

        {onQuickAdd && (
          <button
            type="button"
            onClick={onQuickAdd}
            className={styles.quickAddBtn}
            title="Create a new category"
          >
            + Quick Add
          </button>
        )}
      </div>

      {/* Trigger Box */}
      <button
        type="button"
        id={id}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ""}`}
      >
        <div className={selectedCategory ? styles.selectedContent : styles.placeholder}>
          <span className={styles.categoryIcon} aria-hidden="true">
            {selectedCategory ? "🏷️" : "🔍"}
          </span>

          {selectedCategory ? (
            <div className={styles.textWrapper}>
              <span className={styles.categoryName}>{selectedCategory.name}</span>
              <div className={styles.categoryMeta}>
                <span className={styles.slugBadge}>{selectedCategory.slug}</span>
                {(selectedCategory.parentSubcategory || selectedCategory.parent_subcategory_slug) && (
                  <span>
                    • {selectedCategory.parentSubcategory || selectedCategory.parent_subcategory_slug}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span>{placeholder}</span>
          )}
        </div>

        <div className={styles.triggerActions}>
          <span className={styles.searchIndicator}>
            <span>🔍</span>
            <span>Search</span>
          </span>
          <span className={`${styles.caret} ${isOpen ? styles.caretOpen : ""}`}>
            ▼
          </span>
        </div>
      </button>

      {/* Searchable Dropdown List */}
      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          {/* Sticky Search Header */}
          <div className={styles.searchHeader}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon} aria-hidden="true">🔍</span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories (e.g. Ganesh, Mandir, Jali)..."
                className={styles.searchInput}
                aria-label="Filter categories"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className={styles.clearSearchBtn}
                  aria-label="Clear search"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className={styles.searchMeta}>
              {searchQuery ? (
                <span>
                  Found <span className={styles.metaCount}>{filteredCategories.length}</span> matching categories
                </span>
              ) : (
                <span>
                  Showing all <span className={styles.metaCount}>{categories.length}</span> categories (type to search)
                </span>
              )}

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#8C6D46",
                    fontSize: "0.74rem",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  Show all
                </button>
              )}
            </div>
          </div>

          {/* Filtered Category Items */}
          <div className={styles.listContainer} ref={listRef}>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat, idx) => {
                const isSelected = (selectedCategory?.slug || value) === cat.slug;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <button
                    key={cat.slug || cat.id || idx}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(cat)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`${styles.categoryItem} ${
                      isSelected ? styles.categoryItemSelected : ""
                    } ${isHighlighted ? styles.categoryItemFocused : ""}`}
                  >
                    <div className={styles.itemMain}>
                      <span style={{ fontSize: "1rem", flexShrink: 0 }}>
                        {isSelected ? "✨" : "▫️"}
                      </span>
                      <div>
                        <div className={styles.itemNameRow}>
                          <span className={styles.itemName}>{cat.name}</span>
                          {(cat.parentSubcategory || cat.parent_subcategory_slug) && (
                            <span className={styles.itemSubcat}>
                              {cat.parentSubcategory || cat.parent_subcategory_slug}
                            </span>
                          )}
                        </div>
                        <span className={styles.itemSlug}>{cat.slug}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className={styles.checkMark} title="Selected">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                <span style={{ fontSize: "1.5rem" }}>🔍</span>
                <span className={styles.emptyTitle}>
                  No categories match <strong>&quot;{searchQuery}&quot;</strong>
                </span>

                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className={styles.resetSearchBtn}
                >
                  Clear search and show all categories
                </button>

                {onQuickAdd && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onQuickAdd();
                    }}
                    className={styles.createOptionBtn}
                  >
                    + Create &quot;{searchQuery}&quot; as New Category
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {helperText && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
}
