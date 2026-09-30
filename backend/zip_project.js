const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const zip = new AdmZip();

const excludeDirs = [
  'node_modules',
  'venv',
  '.git',
  'dist',
  '.cache'
];

function addFolderToZip(folderPath, zipFolderPath = "") {
  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    const fullPath = path.join(folderPath, item);
    const relativePath = zipFolderPath ? path.join(zipFolderPath, item) : item;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (excludeDirs.includes(item)) {
        continue;
      }
      addFolderToZip(fullPath, relativePath);
    } else {
      // addLocalFile requires the base directory path in the archive
      const zipPath = path.dirname(relativePath) === '.' ? '' : path.dirname(relativePath);
      zip.addLocalFile(fullPath, zipPath);
    }
  }
}

try {
  console.log('Adding files to zip archive...');
  // Add Face_attendance folder content
  addFolderToZip(path.join(__dirname, '..'), 'Face_attendance');

  // Add root files
  const rootDir = path.join(__dirname, '../..');
  const rootFiles = ['package.json', 'package-lock.json', 'project_report.md', 'project_implementation_report.md', 'pyrightconfig.json'];
  for (const file of rootFiles) {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      zip.addLocalFile(filePath, '');
    }
  }

  // Add .vscode folder if exists
  const vscodeDir = path.join(rootDir, '.vscode');
  if (fs.existsSync(vscodeDir)) {
    addFolderToZip(vscodeDir, '.vscode');
  }

  const outputPath = path.join(rootDir, 'Face_attendance_updated.zip');
  console.log('Writing zip archive to disk...');
  zip.writeZip(outputPath);
  console.log('✅ Success! Zip file created successfully at:', outputPath);
} catch (error) {
  console.error('❌ Failed to create zip file:', error.message);
  process.exit(1);
}
