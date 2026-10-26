import sharp from 'sharp';
import fs from 'fs';

const banners = [
  'public/uploads/categories/raw/hanuman-ji-1789474284146-xq3jf.png',
  'public/uploads/categories/raw/durga-ji-1789476561773-11u8h.png',
  'public/uploads/categories/raw/saraswati-ji-1789482356633-j5ef5.png',
  'public/uploads/categories/raw/lakshmi-ji-1789482097538-kg6pl.png',
  'public/uploads/categories/raw/ram-darbar-1789804266160-exo6u.png'
];

async function check() {
  for (const b of banners) {
    if (fs.existsSync(b)) {
      const meta = await sharp(b).metadata();
      console.log(b, meta.width, 'x', meta.height);
    }
  }
}

check();
