import fs from 'fs/promises';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'categories', 'display');

const filesToRemove = [
  'sculptures-statues-1787142404442-sm5p0.webp',
  'sculptures-statues-1787164620381-2uifq.webp',
  'sculptures-statues-1787166617396-zz5dt.webp',
  'sculptures-statues-1787167164572-7dspl.webp',
  'sculptures-statues-1787167275095-mv34e.webp'
];

async function cleanOrphans() {
  console.log("Safely unlinking verified unreferenced orphaned upload assets...");
  for (const file of filesToRemove) {
    const filePath = path.join(uploadDir, file);
    try {
      const stat = await fs.stat(filePath);
      await fs.unlink(filePath);
      console.log(`Unlinked orphan: ${file} (${(stat.size / 1024).toFixed(0)} KB saved)`);
    } catch (e) {
      console.warn(`File ${file} already removed or missing.`);
    }
  }
}

cleanOrphans().catch(console.error);
