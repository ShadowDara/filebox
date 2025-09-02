// post-build.js

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Diese zwei Zeilen brauchst du, um __dirname in ES Modules zu simulieren
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function copyFolder(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyFolder(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

// Beispiel: relative Pfade ausgehend vom Skriptverzeichnis
const source = path.join(__dirname, 'dist');    // z.B. React build-Ordner
const target = path.join(__dirname, '..', 'static');  // Zielverzeichnis anpassen

copyFolder(source, target)
  .then(() => console.log('Ordner erfolgreich kopiert.'))
  .catch(err => console.error('Fehler beim Kopieren:', err));
