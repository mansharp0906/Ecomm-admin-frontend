const fs = require('fs');
const path = require('path');

// Files that need Container and Breadcrumb imports
const filesToFix = [
  'app/containers/Products/sub sub category/SubSubCategoryView.jsx',
  'app/containers/Products/sub sub category/SubSubCategoryPage.jsx',
  'app/containers/Products/sub sub category/SubSubCategoryFormPage.jsx',
  'app/containers/Products/sub category/SubCategoryView.jsx',
  'app/containers/Products/sub category/SubCategoryFormPage.jsx',
  'app/containers/Products/sub category/SubCategory.jsx',
  'app/containers/Products/category/CategoryView.jsx',
  'app/containers/Products/category/CategoryFormPage.jsx',
  'app/containers/Products/Brand/BrandView.jsx',
  'app/containers/Products/Brand/BrandPage.jsx',
  'app/containers/Products/Brand/BrandFormPage.jsx',
  'app/containers/Products/Attributes/AttributeformPage.jsx',
  'app/containers/Products/Attributes/AttributeView.jsx',
  'app/containers/Products/Attributes/AttributePage.jsx'
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if Container or Breadcrumb are used but not imported
    const usesContainer = content.includes('<Container') || content.includes('Container>');
    const usesBreadcrumb = content.includes('<Breadcrumb') || content.includes('Breadcrumb>');
    
    if (usesContainer || usesBreadcrumb) {
      // Check if already imported
      const hasContainerImport = content.includes("Container") && content.includes("from '@/components'");
      const hasBreadcrumbImport = content.includes("Breadcrumb") && content.includes("from '@/components'");
      
      if (!hasContainerImport || !hasBreadcrumbImport) {
        // Find existing @/components import
        const importRegex = /import\s*{([^}]+)}\s*from\s*'@\/components';/;
        const match = content.match(importRegex);
        
        if (match) {
          // Update existing import
          let imports = match[1].split(',').map(imp => imp.trim());
          
          if (usesContainer && !imports.includes('Container')) {
            imports.push('Container');
          }
          if (usesBreadcrumb && !imports.includes('Breadcrumb')) {
            imports.push('Breadcrumb');
          }
          
          const newImport = `import { ${imports.join(', ')} } from '@/components';`;
          content = content.replace(importRegex, newImport);
          modified = true;
        } else {
          // Add new import
          const imports = [];
          if (usesContainer) imports.push('Container');
          if (usesBreadcrumb) imports.push('Breadcrumb');
          
          const newImport = `import { ${imports.join(', ')} } from '@/components';\n`;
          content = newImport + content;
          modified = true;
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed imports in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Process all files
filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    fixFile(file);
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log('Missing imports fixing completed!');
