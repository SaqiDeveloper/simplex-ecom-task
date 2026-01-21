const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const sourceDirs = [
  { src: 'middlewares/validationSchemas', dest: 'middlewares/validationSchemas' },
  { src: 'swagger', dest: 'swagger' },
  { src: 'workers', dest: 'workers' },
];

// Copy swagger.js
const swaggerSrc = path.join(__dirname, '..', 'config', 'swagger.js');
const swaggerDest = path.join(distDir, 'config', 'swagger.js');
if (fs.existsSync(swaggerSrc)) {
  if (!fs.existsSync(path.dirname(swaggerDest))) {
    fs.mkdirSync(path.dirname(swaggerDest), { recursive: true });
  }
  fs.copyFileSync(swaggerSrc, swaggerDest);
  console.log('✓ Copied swagger.js');
}

// Copy directories
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    return;
  }
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

sourceDirs.forEach(({ src, dest }) => {
  const srcPath = path.join(__dirname, '..', src);
  const destPath = path.join(distDir, dest);
  
  if (fs.existsSync(srcPath)) {
    copyDir(srcPath, destPath);
    console.log(`✓ Copied ${src} to dist/${dest}`);
  }
});

// Fix paths in copied JS files
function fixPaths(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      fixPaths(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix asyncErrorHandler imports - add .default
      content = content.replace(
        /require\(['"]\.\.\/\.\.\/utils\/asyncErrorHandler['"]\)/g,
        "require('../../utils/asyncErrorHandler').default"
      );
      content = content.replace(
        /require\(['"]\.\.\/utils\/asyncErrorHandler['"]\)/g,
        "require('../utils/asyncErrorHandler').default"
      );
      content = content.replace(
        /require\(['"]\.\.\/\.\.\/\.\.\/utils\/asyncErrorHandler['"]\)/g,
        "require('../../../utils/asyncErrorHandler').default"
      );
      
      // Remove any dist/ prefixes from paths (since we're already in dist)
      content = content.replace(/require\(['"]\.\.\/\.\.\/dist\//g, "require('../../");
      content = content.replace(/require\(['"]\.\.\/dist\//g, "require('../");
      content = content.replace(/require\(['"]\.\.\/\.\.\/\.\.\/dist\//g, "require('../../../");
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

// Fix paths in services, controllers, and middlewares
['services', 'controllers', 'middlewares'].forEach(dir => {
  const dirPath = path.join(distDir, dir);
  if (fs.existsSync(dirPath)) {
    fixPaths(dirPath);
  }
});

console.log('✓ Build assets copied and paths fixed');

