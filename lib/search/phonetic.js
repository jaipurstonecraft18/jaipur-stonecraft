// Lightweight Phonetic Key & Sound-Matching Utility for Jaipur Stonecraft Domain

// 1. Simplify & Collapse Repeated Characters / Vowels (Consonantal Skeleton)
export function getConsonantSkeleton(str) {
  if (!str) return "";
  let clean = str.toLowerCase().trim()
    .replace(/[^a-z]/g, "")
    .replace(/sh/g, "s")   // Normalize 'sh' -> 's' for Indian phonetic variants (krishna/krisna, ganesh/ganes)
    .replace(/ch/g, "c")   // Normalize 'ch' -> 'c'
    .replace(/ph/g, "f")   // Normalize 'ph' -> 'f'
    .replace(/y/g, "i")
    .replace(/v/g, "w");

  // Keep first letter, remove subsequent vowels (a, e, i, o, u)
  const firstLetter = clean.charAt(0);
  const restConsonants = clean.slice(1).replace(/[aeiou]/g, "");

  // Collapse consecutive duplicate consonants (e.g. ganeshh -> ganesh)
  const collapsed = (firstLetter + restConsonants).replace(/(.)\1+/g, "$1");
  return collapsed;
}

// 2. Simplified Metaphone Code Generator
export function getPhoneticKey(str) {
  if (!str) return "";
  let word = str.toLowerCase().trim().replace(/[^a-z]/g, "");
  if (!word) return "";

  // Common replacements for Indian stonecraft domain phonetics
  word = word
    .replace(/^kn/, "n")
    .replace(/sh/g, "X")
    .replace(/sch/g, "X")
    .replace(/ch/g, "X")
    .replace(/ck/g, "K")
    .replace(/c(?=[iey])/g, "S")
    .replace(/c/g, "K")
    .replace(/dg/g, "J")
    .replace(/ph/g, "F")
    .replace(/gh/g, "G")
    .replace(/th/g, "T")
    .replace(/v/g, "W")
    .replace(/z/g, "S");

  // Collapse duplicates
  word = word.replace(/(.)\1+/g, "$1");

  const firstChar = word.charAt(0);
  const rest = word.slice(1).replace(/[aeiouy]/g, "");
  
  return (firstChar + rest).toUpperCase();
}

// 3. Domain Vocabulary Dictionary for High-Confidence Typo & Phonetic Recovery
export const DOMAIN_VOCABULARY = [
  { term: "Krishna", variants: ["krishna", "krshna", "krisna", "krishn", "krishnaa", "kisna"] },
  { term: "Ganesh", variants: ["ganesh", "ganeshh", "ganesa", "ganpati", "gajanand"] },
  { term: "Shiva", variants: ["shiva", "siva", "shiv", "mahadev", "bholenath"] },
  { term: "Marble", variants: ["marble", "marbel", "mable", "marbl", "makrana"] },
  { term: "Sandstone", variants: ["sandstone", "sandston", "bansi", "dholpur"] },
  { term: "Fountain", variants: ["fountain", "fountan", "fountn", "fountin"] },
  { term: "Sculpture", variants: ["sculpture", "scultpure", "sculptur", "statue"] },
  { term: "Temple", variants: ["temple", "templee", "templ", "mandir"] },
  { term: "Relief", variants: ["relief", "releif", "mural", "carving"] },
  { term: "Jali", variants: ["jali", "jaali", "jharokha", "lattice"] },
];

// 4. Resolve Best Phonetic Correction for a Word
export function resolvePhoneticCorrection(word) {
  if (!word || word.length < 3) return null;
  const cleanWord = word.toLowerCase().trim();
  const inputSkeleton = getConsonantSkeleton(cleanWord);
  const inputPhonetic = getPhoneticKey(cleanWord);

  for (const item of DOMAIN_VOCABULARY) {
    // Check direct known variants
    if (item.variants.includes(cleanWord)) {
      return item.term;
    }

    const termSkeleton = getConsonantSkeleton(item.term);
    const termPhonetic = getPhoneticKey(item.term);

    // Check consonant skeleton match (e.g. krshna vs krishna -> krsn vs krsn)
    if (inputSkeleton === termSkeleton) {
      return item.term;
    }

    // Check metaphone key match
    if (inputPhonetic === termPhonetic && inputPhonetic.length >= 3) {
      return item.term;
    }
  }

  return null;
}
