/**
 * Jaipur Stonecraft — Heritage Materials Database (SQLite-Backed)
 * 
 * STRICT RULE: Granite is strictly excluded from all materials, taxonomy, and content.
 */

import getDB from "./client.js";

export const materialsData = {
  "makrana-pure-white": {
    id: "makrana-pure-white",
    name: "Makrana Pure White Marble",
    shortName: "Makrana White",
    category: "Marble",
    origin: "Makrana, Rajasthan, India",
    characteristics: [
      "Pristine white tone with soft translucent depth",
      "98%+ calcium carbonate purity",
      "Zero artificial sealants required",
      "Impervious to water and climate erosion"
    ],
    durability: "Indoor, Outdoor & Sacred Sanctuary",
    colorFamily: "White",
    popularApplications: ["Deity Statues", "Home Mandirs", "Royal Courtyard Statuary"]
  },
  "sangemarmar-white": {
    id: "sangemarmar-white",
    name: "Sangemarmar White Marble",
    shortName: "Sangemarmar",
    category: "Marble",
    origin: "Rajasthan, India",
    characteristics: [
      "Traditional Indian temple marble",
      "Smooth micro-crystalline texture",
      "Ideal for intricate facial chiseling"
    ],
    durability: "Indoor & Sacred Sanctuary",
    colorFamily: "White",
    popularApplications: ["Idols & Sculptures", "Pooja Room Panels"]
  },
  "black-bhainslana": {
    id: "black-bhainslana",
    name: "Black Bhainslana Marble",
    shortName: "Black Marble",
    category: "Marble",
    origin: "Bhainslana, Rajasthan, India",
    characteristics: [
      "Deep obsidian black with subtle grey veining",
      "High density stone",
      "Striking contrast for divine iconography"
    ],
    durability: "Indoor & Exterior Statuary",
    colorFamily: "Black",
    popularApplications: ["Shiva Statues", "Modern Art Sculptures", "Water Features"]
  },
  "pink-bansi-paharpur": {
    id: "pink-bansi-paharpur",
    name: "Pink Bansi Paharpur Sandstone",
    shortName: "Pink Sandstone",
    category: "Sandstone",
    origin: "Bansi Paharpur, Rajasthan, India",
    characteristics: [
      "Warm blush pink hue",
      "Revered royal architectural stone used in Rajasthan palaces",
      "Exceptional longevity in outdoor climate"
    ],
    durability: "All-Weather Exterior & Temple Architecture",
    colorFamily: "Pink",
    popularApplications: ["Temple Columns", "Architectural Jalis", "Garden Fountains"]
  },
  "jodhpur-red-sandstone": {
    id: "jodhpur-red-sandstone",
    name: "Jodhpur Royal Red Sandstone",
    shortName: "Jodhpur Red",
    category: "Sandstone",
    origin: "Jodhpur, Rajasthan, India",
    characteristics: [
      "Terracotta red to rich amber tone",
      "Fine grain structural stone",
      "Classic fort & heritage aesthetic"
    ],
    durability: "All-Weather Exterior",
    colorFamily: "Pink/Red",
    popularApplications: ["Facade Murals", "Lattice Jali Screens", "Gateways"]
  },
  "dholpur-beige-sandstone": {
    id: "dholpur-beige-sandstone",
    name: "Dholpur Beige Sandstone",
    shortName: "Dholpur Beige",
    category: "Sandstone",
    origin: "Dholpur, Rajasthan, India",
    characteristics: [
      "Subtle cream-beige tone",
      "Soft tactile finish",
      "Complements modern and traditional architectural spaces"
    ],
    durability: "All-Weather Exterior & Interior",
    colorFamily: "Beige",
    popularApplications: ["Relief Wall Murals", "Outdoor Planters", "Pillars"]
  },
  "jaisalmer-yellow-limestone": {
    id: "jaisalmer-yellow-limestone",
    name: "Jaisalmer Yellow Golden Limestone",
    shortName: "Jaisalmer Gold",
    category: "Limestone",
    origin: "Jaisalmer, Rajasthan, India",
    characteristics: [
      "Luminous golden honey yellow color",
      "Fossilized natural patterns",
      "Evokes desert royal elegance"
    ],
    durability: "Interior & Covered Exterior",
    colorFamily: "Golden Yellow",
    popularApplications: ["Decorative Urns", "Wall Reliefs", "Carved Accent Tiles"]
  },
  "natural-onyx": {
    id: "natural-onyx",
    name: "Natural Translucent Onyx",
    shortName: "Natural Onyx",
    category: "Natural Onyx",
    origin: "Rajasthan / International Quarries",
    characteristics: [
      "High translucency for backlit features",
      "Exotic banding and crystalline luster"
    ],
    durability: "Luxury Interior Accent",
    colorFamily: "Honey/Green/Amber",
    popularApplications: ["Bespoke Decor", "Backlit Relief Panels"]
  }
};

export function getMaterial(id) {
  try {
    const db = getDB();
    const matRow = db.prepare("SELECT * FROM materials WHERE id = ?").get(id);
    if (matRow) {
      const fallback = materialsData[id] || {};
      return {
        id: matRow.id,
        name: matRow.name,
        shortName: fallback.shortName || matRow.name,
        category: matRow.category,
        origin: matRow.origin,
        characteristics: fallback.characteristics || [],
        durability: matRow.durability,
        colorFamily: matRow.color_family,
        popularApplications: fallback.popularApplications || []
      };
    }
  } catch (e) {}

  return materialsData[id] || null;
}

export function getAllMaterials() {
  try {
    const db = getDB();
    const matRows = db.prepare("SELECT * FROM materials").all();
    if (matRows && matRows.length > 0) {
      return matRows.map((matRow) => {
        const fallback = materialsData[matRow.id] || {};
        return {
          id: matRow.id,
          name: matRow.name,
          shortName: fallback.shortName || matRow.name,
          category: matRow.category,
          origin: matRow.origin,
          characteristics: fallback.characteristics || [],
          durability: matRow.durability,
          colorFamily: matRow.color_family,
          popularApplications: fallback.popularApplications || []
        };
      });
    }
  } catch (e) {}

  return Object.values(materialsData);
}
