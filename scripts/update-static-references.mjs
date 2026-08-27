import fs from 'fs/promises';
import path from 'path';

const filesToUpdate = [
  'content/collection-personalities.js',
  'content/categories.js',
  'lib/db/seeders.js',
  'components/HomeCollections/HomeCollections.js',
  'components/Hero/Hero.js',
  'components/CraftProcess/CraftProcess.js',
  'components/FeaturedCreations/FeaturedCreations.js',
  'components/OurStory/StoryHeader.js',
  'components/OurStory/StoryFutureSection.js',
  'components/CollectionDetail/SubcollectionExploration.js',
  'components/CollectionDetail/CollectionFeaturedArtworks.js',
  'components/CollectionDetail/CollectionDetailHero.js'
];

const replacements = [
  ['/images/collections/hero-sculptures-group.jpg', '/images/collections/hero-sculptures-group.webp'],
  ['/images/collections/wall-art-relief.jpg', '/images/collections/wall-art-relief.webp'],
  ['/images/collections/temples-architectural.jpg', '/images/collections/temples-architectural.webp'],
  ['/images/collections/architectural.png', '/images/collections/architectural.webp'],
  ['/images/collections/custom.png', '/images/collections/custom.webp'],
  ['/images/collections/garden.png', '/images/collections/garden.webp'],
  ['/images/collections/luxury.png', '/images/collections/luxury.webp'],
  ['/images/collections/sacred.png', '/images/collections/sacred.webp']
];

async function updateReferences() {
  console.log("Updating static collection asset references to .webp format...");
  for (const relPath of filesToUpdate) {
    const fullPath = path.join(process.cwd(), relPath);
    try {
      let content = await fs.readFile(fullPath, 'utf8');
      let modified = false;
      for (const [from, to] of replacements) {
        if (content.includes(from)) {
          content = content.replaceAll(from, to);
          modified = true;
        }
      }
      if (modified) {
        await fs.writeFile(fullPath, content, 'utf8');
        console.log(`Updated ${relPath}`);
      }
    } catch (err) {
      console.warn(`Skipped ${relPath}: ${err.message}`);
    }
  }
}

updateReferences().catch(console.error);
