/**
 * Jaipur Stonecraft — Central Product Database: Subjects Entity Store
 * 
 * Defines domain subjects, deity entities, architectural categories, and synonym aliases
 * for data-driven search normalization and fallback matching.
 */

export const subjectsDB = [
  {
    id: "ganesh",
    primaryName: "Lord Ganesha",
    synonyms: ["Ganesha", "Ganpati", "Ganesh Ji", "Vighnaharta", "Vinayaka", "Moorti", "Murti"],
    tradition: "Hindu Sacred Iconography",
    iconographyElements: ["Modak", "Trunk Curvature", "Crown (Mukut)", "Mouse (Mooshak)", "Four Arms"],
    defaultCategorySlug: "ganesh-ji"
  },
  {
    id: "krishna",
    primaryName: "Lord Krishna",
    synonyms: ["Krishna", "Krishna Ji", "Muralidhar", "Bal Krishna", "Govinda", "Radha Krishna", "Kanhaiya"],
    tradition: "Hindu Sacred Iconography",
    iconographyElements: ["Flute (Bansi)", "Peacock Feather (Mor Pankh)", "Sacred Cow (Kamadhenu)", "Kadamba Tree"],
    defaultCategorySlug: "krishna-ji"
  },
  {
    id: "shiva",
    primaryName: "Lord Shiva",
    synonyms: ["Shiva", "Shiva Ji", "Mahadev", "Nataraja", "Shiva Lingam", "Adiyogi", "Bholenath", "Lingam"],
    tradition: "Hindu Sacred Iconography",
    iconographyElements: ["Trishul", "Damru", "Crescent Moon", "Cobra (Vasuki)", "Third Eye"],
    defaultCategorySlug: "shiva-ji"
  },
  {
    id: "ram",
    primaryName: "Lord Ram",
    synonyms: ["Ram", "Ram Ji", "Ram Lalla", "Ram Darbar", "Sita Ram", "Raghunandan"],
    tradition: "Hindu Sacred Iconography",
    iconographyElements: ["Bow (Dhanush)", "Arrow", "Crown", "Devotional Stance"],
    defaultCategorySlug: "ram-parivar"
  },
  {
    id: "hanuman",
    primaryName: "Lord Hanuman",
    synonyms: ["Hanuman", "Hanuman Ji", "Bajrangbali", "Pavanputra", "Sankat Mochan", "Maruti"],
    tradition: "Hindu Sacred Iconography",
    iconographyElements: ["Mace (Gada)", "Dronagiri Mountain", "Masonic Devotional Stance"],
    defaultCategorySlug: "hanuman-ji"
  },
  {
    id: "durga-lakshmi-saraswati",
    primaryName: "Goddess Statues",
    synonyms: ["Durga", "Lakshmi", "Saraswati", "Maa Durga", "Goddess", "Devi", "Sherawali", "Laxmi"],
    tradition: "Hindu Sacred Iconography",
    iconographyElements: ["Lotus Base", "Trishul", "Veena", "Golden Crown"],
    defaultCategorySlug: "durga-ji"
  },
  {
    id: "buddha",
    primaryName: "Lord Buddha",
    synonyms: ["Buddha", "Gautama Buddha", "Siddhartha", "Dhyani Buddha", "Zen Statue"],
    tradition: "Buddhist Sacred Art",
    iconographyElements: ["Dhyana Mudra", "Bhumisparsha Mudra", "Ushnisha", "Lotus Pedestal"],
    defaultCategorySlug: "buddha-statues"
  },
  {
    id: "animal-sculpture",
    primaryName: "Animal Sculptures",
    synonyms: ["Animal", "Lion", "Elephant", "Horse", "Panther", "Nandi", "Cow", "Swan", "Peacock"],
    tradition: "Classical & Heritage Stone Art",
    iconographyElements: ["Hand Carved Musculature", "Polished Marble Finish", "Courtyard Scale"],
    defaultCategorySlug: "animal-statues"
  },
  {
    id: "human-bust",
    primaryName: "Human Busts & Portrait Sculptures",
    synonyms: ["Bust", "Portrait", "Human Statue", "Head Carving", "Custom Portrait", "Memorial Statue"],
    tradition: "Fine Masonic Portraiture",
    iconographyElements: ["Anatomical Precision", "Smooth Skin Finish", "Marble Base"],
    defaultCategorySlug: "bust-portrait-sculptures"
  },
  {
    id: "mandir",
    primaryName: "Marble Mandirs & Temples",
    synonyms: ["Mandir", "Temple", "Pooja Temple", "Home Mandir", "Ghar Mandir", "Pooja Room", "Shikhara"],
    tradition: "Sacred Architectural Stonework",
    iconographyElements: ["Carved Pillars", "Lattice Panels", "Domes", "Sanctuary Arch"],
    defaultCategorySlug: "marble-home-temples"
  },
  {
    id: "fountain",
    primaryName: "Water Fountains & Lotus Basins",
    synonyms: ["Fountain", "Water Feature", "Waterfall", "Lotus Basin", "Tiered Fountain", "Courtyard Fountain"],
    tradition: "Landscape & Water Feature Architecture",
    iconographyElements: ["Carved Scalloped Tiers", "Central Spout", "Lotus Petal Edging"],
    defaultCategorySlug: "tiered-water-fountains"
  },
  {
    id: "jali-screen",
    primaryName: "Carved Jali Screen",
    synonyms: ["Jali", "Stone Lattice", "Geometric Lattice", "Arched Jali", "Screen", "Perforated Panel"],
    tradition: "Rajasthani Architectural Stonework",
    iconographyElements: ["Star Geometrics", "Lotus Lattice Petals", "Arched Frames"],
    defaultCategorySlug: "jali-screens"
  }
];

