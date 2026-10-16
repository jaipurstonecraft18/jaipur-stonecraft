"use client";

import { useState, useEffect } from "react";
import styles from "./DiscoverySectionsManager.module.css";

/**
 * Admin Studio Discovery Sections Manager
 * Provides non-destructive, normalized management of the Homepage Discovery Sliders.
 * References existing categories, subcategories, and collections without duplicating product data.
 */
export default function DiscoverySectionsManager({
  statuesSection,
  setStatuesSection,
  archSection,
  setArchSection,
  onSave,
  saving,
  handleImageUpload
}) {
  const [activeSubTab, setActiveSubTab] = useState("statues"); // "statues" | "arch"
  const [showAddModal, setShowAddModal] = useState(false);
  const [entityFilter, setEntityFilter] = useState("");
  const [entityTypeTab, setEntityTypeTab] = useState("all"); // "all" | "categories" | "subcategories" | "collections"
  const [availableEntities, setAvailableEntities] = useState({ categories: [], subcategories: [], collections: [] });
  const [loadingEntities, setLoadingEntities] = useState(false);

  // Fetch real existing entities from Admin API once when modal opens
  useEffect(() => {
    if (showAddModal && availableEntities.categories.length === 0) {
      setLoadingEntities(true);
      fetch("/api/admin/categories")
        .then((res) => res.json())
        .then((data) => {
          setAvailableEntities({
            categories: Array.isArray(data.categories) ? data.categories : [],
            subcategories: Array.isArray(data.subcategories) ? data.subcategories : [],
            collections: Array.isArray(data.collections) ? data.collections : []
          });
        })
        .catch((e) => console.error("Failed to load taxonomy entities:", e))
        .finally(() => setLoadingEntities(false));
    }
  }, [showAddModal, availableEntities.categories.length]);

  const currentSection = activeSubTab === "statues" ? statuesSection : archSection;
  const setCurrentSection = activeSubTab === "statues" ? setStatuesSection : setArchSection;
  const currentKeyName = activeSubTab === "statues" ? "homepage_discovery_statues" : "homepage_discovery_arch";

  // Reorder Item: Move Up
  const moveItemUp = (index) => {
    if (index === 0) return;
    const items = [...(currentSection.items || [])];
    const temp = items[index - 1];
    items[index - 1] = items[index];
    items[index] = temp;
    setCurrentSection({ ...currentSection, items });
  };

  // Reorder Item: Move Down
  const moveItemDown = (index) => {
    const items = [...(currentSection.items || [])];
    if (index >= items.length - 1) return;
    const temp = items[index + 1];
    items[index + 1] = items[index];
    items[index] = temp;
    setCurrentSection({ ...currentSection, items });
  };

  // Toggle Item Active State
  const toggleItemActive = (index) => {
    const items = [...(currentSection.items || [])];
    items[index] = { ...items[index], isActive: !items[index].isActive };
    setCurrentSection({ ...currentSection, items });
  };

  // Update specific item property
  const updateItemField = (index, field, value) => {
    const items = [...(currentSection.items || [])];
    items[index] = { ...items[index], [field]: value };
    setCurrentSection({ ...currentSection, items });
  };

  // Remove Item from Homepage Slider (Does NOT delete category/product from database)
  const removeItem = (index) => {
    const item = currentSection.items?.[index];
    const confirmMsg = `Remove "${item?.title || "this item"}" from the homepage slider?\n\n(Note: This removes it from the homepage rail only. The product/category remains in your database.)`;
    if (window.confirm(confirmMsg)) {
      const items = [...(currentSection.items || [])];
      items.splice(index, 1);
      setCurrentSection({ ...currentSection, items });
    }
  };

  // Add selected entity to current slider
  const handleSelectEntity = (entity, type) => {
    let canonicalHref = "/collections";
    let defaultLabel = activeSubTab === "statues" ? "Marble Statues" : "Architectural Art";

    if (type === "category") {
      canonicalHref = `/collections/${entity.parentCollection || "sculptures-statues"}/${entity.parentSubcategory || "hindu-sculptures"}/${entity.slug}`;
      defaultLabel = activeSubTab === "statues" ? "Marble Statues" : "Reliefs & Carvings";
    } else if (type === "subcategory") {
      canonicalHref = `/collections/${entity.parentCollection || "temples-architectural-stonework"}/${entity.slug}`;
      defaultLabel = "Sacred Architecture";
    } else if (type === "collection") {
      canonicalHref = `/collections/${entity.slug}`;
      defaultLabel = "Heritage Collection";
    }

    const newItem = {
      id: `${type}-${entity.slug}-${Date.now()}`,
      entityType: type,
      entitySlug: entity.slug,
      title: entity.name,
      category: defaultLabel,
      imageSrc: entity.imageSrc || entity.image_src || "/images/collections/hero-sculptures-group.webp",
      customImage: "",
      imageAlt: `${entity.name} hand-carved stone art in Jaipur atelier`,
      href: canonicalHref,
      isActive: true
    };

    setCurrentSection({
      ...currentSection,
      items: [...(currentSection.items || []), newItem]
    });
    setShowAddModal(false);
  };

  // Filter entities in Add Modal
  const allFlattenedEntities = [];
  if (entityTypeTab === "all" || entityTypeTab === "categories") {
    availableEntities.categories.forEach((c) =>
      allFlattenedEntities.push({ ...c, _type: "category", _typeLabel: "Category" })
    );
  }
  if (entityTypeTab === "all" || entityTypeTab === "subcategories") {
    availableEntities.subcategories.forEach((s) =>
      allFlattenedEntities.push({ ...s, _type: "subcategory", _typeLabel: "Subcategory" })
    );
  }
  if (entityTypeTab === "all" || entityTypeTab === "collections") {
    availableEntities.collections.forEach((col) =>
      allFlattenedEntities.push({ ...col, _type: "collection", _typeLabel: "Collection" })
    );
  }

  const filteredEntities = allFlattenedEntities.filter((e) => {
    if (!entityFilter.trim()) return true;
    const q = entityFilter.toLowerCase();
    return (
      (e.name && e.name.toLowerCase().includes(q)) ||
      (e.slug && e.slug.toLowerCase().includes(q))
    );
  });

  return (
    <div className={styles.managerContainer}>
      {/* 1. Header & Navigation Sub-Tabs */}
      <div className={styles.topControlCard}>
        <div className={styles.headerTitleGroup}>
          <div className={styles.badgeRow}>
            <span className={styles.activeTag}>NEW HOMEPAGE ATELIER SLIDERS</span>
            <span className={styles.infoTag}>Dynamic Content &amp; Normalized Entity References</span>
          </div>
          <h3 className={styles.mainTitle}>Discovery Sections Manager</h3>
          <p className={styles.subTitle}>
            Manage continuous horizontal discovery rails on the homepage without editing code.
            Choose which categories appear, reorder items, or toggle visibility.
          </p>
        </div>

        {/* Sub-Tabs: Statues vs Architectural */}
        <div className={styles.subTabNav}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeSubTab === "statues" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveSubTab("statues")}
          >
            <span className={styles.tabIcon}>🕉️</span>
            <span>1. Popular Statues Slider</span>
            <span className={styles.tabCount}>
              ({(statuesSection.items || []).filter((i) => i.isActive !== false).length} Active)
            </span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeSubTab === "arch" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveSubTab("arch")}
          >
            <span className={styles.tabIcon}>🏛️</span>
            <span>2. Murals, Jalis &amp; Architectural Art</span>
            <span className={styles.tabCount}>
              ({(archSection.items || []).filter((i) => i.isActive !== false).length} Active)
            </span>
          </button>
        </div>
      </div>

      {/* 2. Active Section Configuration Card */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeaderRow}>
          <div className={styles.sectionMeta}>
            <div className={styles.enableToggleRow}>
              <label className={styles.switchLabel}>
                <input
                  type="checkbox"
                  checked={currentSection.enabled !== false}
                  onChange={(e) => setCurrentSection({ ...currentSection, enabled: e.target.checked })}
                  className={styles.switchInput}
                />
                <span className={styles.switchSlider} />
                <span className={styles.switchText}>
                  {currentSection.enabled !== false ? "Section is Visible on Public Homepage" : "Section is Hidden"}
                </span>
              </label>
            </div>
            <h4 className={styles.sectionHeading}>
              {activeSubTab === "statues"
                ? "Popular Marble Statues Discovery Rail"
                : "Murals, Jalis, Mandirs & Architectural Art Rail"}
            </h4>
          </div>

          <button
            type="button"
            onClick={() => onSave(currentKeyName, currentSection)}
            className={styles.saveBtn}
            disabled={saving}
          >
            {saving ? "Saving Changes..." : `Save ${activeSubTab === "statues" ? "Statues" : "Architectural"} Section`}
          </button>
        </div>

        {/* Section General Settings */}
        <div className={styles.settingsGrid}>
          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>Section Eyebrow</label>
            <input
              type="text"
              value={currentSection.eyebrow || ""}
              onChange={(e) => setCurrentSection({ ...currentSection, eyebrow: e.target.value })}
              className={styles.textInput}
              placeholder="e.g. POPULAR CHOICES"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>Main Section Heading</label>
            <input
              type="text"
              value={currentSection.heading || ""}
              onChange={(e) => setCurrentSection({ ...currentSection, heading: e.target.value })}
              className={styles.textInput}
              placeholder="e.g. Most Sought-After Marble Statues"
            />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.inputLabel}>Supporting Subtitle Line</label>
            <input
              type="text"
              value={currentSection.supportingText || ""}
              onChange={(e) => setCurrentSection({ ...currentSection, supportingText: e.target.value })}
              className={styles.textInput}
              placeholder="e.g. Sacred forms. Timeless craftsmanship."
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>Right-Aligned Action Link Text</label>
            <input
              type="text"
              value={currentSection.exploreText || ""}
              onChange={(e) => setCurrentSection({ ...currentSection, exploreText: e.target.value })}
              className={styles.textInput}
              placeholder="e.g. EXPLORE ALL STATUES"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>Action Link Destination (URL)</label>
            <input
              type="text"
              value={currentSection.exploreHref || ""}
              onChange={(e) => setCurrentSection({ ...currentSection, exploreHref: e.target.value })}
              className={styles.textInput}
              placeholder="e.g. /collections/sculptures-statues"
            />
          </div>
        </div>

        {/* 3. Items List Management */}
        <div className={styles.itemsSection}>
          <div className={styles.itemsHeader}>
            <div>
              <h5 className={styles.itemsHeading}>
                Configured Rail Items ({(currentSection.items || []).length})
              </h5>
              <p className={styles.itemsHelp}>
                Continuous slider displays these cards in the exact order shown below. Use the arrows to reorder.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className={styles.addBtn}
            >
              <span>+</span> Add Existing Category / Entity
            </button>
          </div>

          {/* Cards List */}
          <div className={styles.itemsList}>
            {(currentSection.items || []).map((item, idx) => {
              const displayImage = item.customImage || item.imageSrc || item.fallbackImage || "/images/collections/hero-sculptures-group.webp";

              return (
                <div
                  key={item.id || idx}
                  className={`${styles.itemCard} ${item.isActive === false ? styles.itemCardDisabled : ""}`}
                >
                  {/* Left Column: Drag & Order Controls */}
                  <div className={styles.orderControls}>
                    <span className={styles.orderIndexBadge}>#{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => moveItemUp(idx)}
                      disabled={idx === 0}
                      className={styles.moveBtn}
                      title="Move Up"
                      aria-label={`Move ${item.title} up`}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItemDown(idx)}
                      disabled={idx === (currentSection.items || []).length - 1}
                      className={styles.moveBtn}
                      title="Move Down"
                      aria-label={`Move ${item.title} down`}
                    >
                      ▼
                    </button>
                  </div>

                  {/* Image Thumbnail & Upload */}
                  <div className={styles.imageCol}>
                    <img
                      src={displayImage}
                      alt={item.title || "Preview"}
                      className={styles.thumbImage}
                      onError={(e) => {
                        e.target.src = "https://placehold.co/120x150/E8E4DF/1A1918?text=Image";
                      }}
                    />
                    <div className={styles.imageActions}>
                      <label className={styles.uploadLabel} title="Upload custom image override">
                        <span>Upload Custom</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(e, (url) => updateItemField(idx, "customImage", url))
                          }
                          className={styles.hiddenFileInput}
                        />
                      </label>
                      {item.customImage && (
                        <button
                          type="button"
                          onClick={() => updateItemField(idx, "customImage", "")}
                          className={styles.resetImageBtn}
                          title="Reset to entity primary image"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Item Content Fields */}
                  <div className={styles.fieldsCol}>
                    <div className={styles.fieldRow}>
                      <div className={styles.subField} style={{ flex: 1.4 }}>
                        <label className={styles.miniLabel}>Title</label>
                        <input
                          type="text"
                          value={item.title || ""}
                          onChange={(e) => updateItemField(idx, "title", e.target.value)}
                          className={styles.textInputCompact}
                          placeholder="e.g. Lord Ganesha"
                        />
                      </div>

                      <div className={styles.subField} style={{ flex: 1 }}>
                        <label className={styles.miniLabel}>Short Category Label</label>
                        <input
                          type="text"
                          value={item.category || ""}
                          onChange={(e) => updateItemField(idx, "category", e.target.value)}
                          className={styles.textInputCompact}
                          placeholder="e.g. Marble Statues"
                        />
                      </div>
                    </div>

                    <div className={styles.fieldRow}>
                      <div className={styles.subField} style={{ flex: 2 }}>
                        <label className={styles.miniLabel}>
                          Destination Link (URL)
                          {!item.href?.startsWith("/") && (
                            <span className={styles.warningText}> — Must start with /</span>
                          )}
                        </label>
                        <input
                          type="text"
                          value={item.href || ""}
                          onChange={(e) => updateItemField(idx, "href", e.target.value)}
                          className={styles.textInputCompact}
                          placeholder="/collections/..."
                        />
                      </div>

                      <div className={styles.subField} style={{ flex: 1.5 }}>
                        <label className={styles.miniLabel}>Image URL (or Override)</label>
                        <input
                          type="text"
                          value={item.customImage || item.imageSrc || ""}
                          onChange={(e) => updateItemField(idx, "customImage", e.target.value)}
                          className={styles.textInputCompact}
                          placeholder="/uploads/..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Active Toggle & Remove */}
                  <div className={styles.actionsCol}>
                    <button
                      type="button"
                      onClick={() => toggleItemActive(idx)}
                      className={`${styles.activeToggleBtn} ${item.isActive !== false ? styles.activeToggleOn : styles.activeToggleOff}`}
                      title={item.isActive !== false ? "Click to Disable" : "Click to Enable"}
                    >
                      {item.isActive !== false ? "✓ Active" : "✕ Disabled"}
                    </button>

                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className={styles.removeBtn}
                      title="Remove from homepage slider (keeps product in database)"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}

            {(currentSection.items || []).length === 0 && (
              <div className={styles.emptyState}>
                <p>No items in this slider rail yet.</p>
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className={styles.addBtn}
                  style={{ marginTop: "0.75rem" }}
                >
                  + Add First Category
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className={styles.bottomSaveBar}>
          <span className={styles.saveTip}>
            💾 Clicking save publishes updates to the homepage and refreshes the cache immediately.
          </span>
          <button
            type="button"
            onClick={() => onSave(currentKeyName, currentSection)}
            className={styles.saveBtn}
            disabled={saving}
          >
            {saving ? "Saving..." : `Save ${activeSubTab === "statues" ? "Statues" : "Architectural"} Section`}
          </button>
        </div>
      </div>

      {/* 4. Add Entity Modal Picker */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h4 className={styles.modalTitle}>
                  Select Existing Entity to Add to {activeSubTab === "statues" ? "Statues" : "Architectural"} Slider
                </h4>
                <p className={styles.modalSubtitle}>
                  Pick an existing Category, Subcategory, or Collection. It will automatically populate the image, title, and verified destination link.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className={styles.modalCloseBtn}
              >
                ✕
              </button>
            </div>

            {/* Filter Pills & Search */}
            <div className={styles.modalFilters}>
              <div className={styles.filterPills}>
                <button
                  type="button"
                  className={`${styles.filterPill} ${entityTypeTab === "all" ? styles.filterPillActive : ""}`}
                  onClick={() => setEntityTypeTab("all")}
                >
                  All Entities
                </button>
                <button
                  type="button"
                  className={`${styles.filterPill} ${entityTypeTab === "categories" ? styles.filterPillActive : ""}`}
                  onClick={() => setEntityTypeTab("categories")}
                >
                  Categories ({availableEntities.categories.length})
                </button>
                <button
                  type="button"
                  className={`${styles.filterPill} ${entityTypeTab === "subcategories" ? styles.filterPillActive : ""}`}
                  onClick={() => setEntityTypeTab("subcategories")}
                >
                  Subcategories ({availableEntities.subcategories.length})
                </button>
                <button
                  type="button"
                  className={`${styles.filterPill} ${entityTypeTab === "collections" ? styles.filterPillActive : ""}`}
                  onClick={() => setEntityTypeTab("collections")}
                >
                  Collections ({availableEntities.collections.length})
                </button>
              </div>

              <input
                type="text"
                value={entityFilter}
                onChange={(e) => setEntityFilter(e.target.value)}
                placeholder="Search by name (e.g. Ganesh, Shiva, Mandir, Jali, Mural)..."
                className={styles.modalSearchInput}
                autoFocus
              />
            </div>

            {/* Entities Grid List */}
            <div className={styles.entitiesList}>
              {loadingEntities && (
                <div className={styles.modalLoading}>Loading database categories...</div>
              )}

              {!loadingEntities && filteredEntities.map((entity, i) => (
                <div
                  key={`${entity._type}-${entity.slug}-${i}`}
                  className={styles.entityItemRow}
                  onClick={() => handleSelectEntity(entity, entity._type)}
                >
                  <img
                    src={entity.imageSrc || entity.image_src || "/images/collections/hero-sculptures-group.webp"}
                    alt={entity.name}
                    className={styles.entityThumb}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/80x80/E8E4DF/1A1918?text=Cover";
                    }}
                  />
                  <div className={styles.entityInfo}>
                    <div className={styles.entityTitleRow}>
                      <span className={styles.entityName}>{entity.name}</span>
                      <span className={styles.entityTypeBadge}>{entity._typeLabel}</span>
                    </div>
                    <span className={styles.entitySlug}>slug: {entity.slug}</span>
                  </div>
                  <button type="button" className={styles.selectBtn}>
                    + Select
                  </button>
                </div>
              ))}

              {!loadingEntities && filteredEntities.length === 0 && (
                <div className={styles.modalEmpty}>No matching entities found.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
