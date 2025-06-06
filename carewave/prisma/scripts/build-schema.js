// prisma/scripts/build-schema.js
const fs = require('fs');
const path = require('path');

const PRISMA_DIR = path.join(__dirname, '..');
const MODULES_DIR = path.join(PRISMA_DIR, 'modules');
const OUTPUT_FILE = path.join(PRISMA_DIR, 'schema.prisma');

// List of all your module files in order
const MODULE_FILES = [
  'dashboard.prisma',
  'patients.prisma',
  'doctor.prisma',
  'appointments.prisma',
  'adt.prisma',
  'emergency.prisma',
  'queue-mgmt.prisma',
  'clinical.prisma',
  'laboratory.prisma',
  'radiology.prisma',
  'operation-theatre.prisma',
  'clinical-settings.prisma',
  'cssd.prisma',
  'nursing.prisma',
  'maternity.prisma',
  'vaccination.prisma',
  'pharmacy.prisma',
  'departments.prisma',
  'dispensary.prisma',
  'billing.prisma',
  'accounting.prisma',
  'claim-mgmt.prisma',
  'nhif.prisma',
  'incentive.prisma',
  'inventory.prisma',
  'procurement.prisma',
  'substore.prisma',
  'fixed-assets.prisma',
  'reports.prisma',
  'dynamic-report.prisma',
  'medical-records.prisma',
  'helpdesk.prisma',
  'mkt-referral.prisma',
  'social-service.prisma',
  'settings.prisma',
  'system-admin.prisma',
  'utilities.prisma',
  'verification.prisma',
  'home.prisma',
  'login.prisma',
  'register.prisma'
];

// Base schema with generator and datasource
const BASE_SCHEMA = `// =========================================
// AUTO-GENERATED PRISMA SCHEMA
// DO NOT EDIT THIS FILE DIRECTLY!
// Edit individual module files in /modules instead
// Generated at: ${new Date().toISOString()}
// =========================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

`;

function buildSchema() {
  console.log('🔨 Building Prisma schema from modules...');
  
  let schemaContent = BASE_SCHEMA;
  let processedFiles = 0;
  
  MODULE_FILES.forEach(moduleFile => {
    const modulePath = path.join(MODULES_DIR, moduleFile);
    
    if (fs.existsSync(modulePath)) {
      console.log(`📄 Processing: ${moduleFile}`);
      
      const moduleContent = fs.readFileSync(modulePath, 'utf8');
      const cleanContent = cleanModuleContent(moduleContent);
      
      if (cleanContent.trim()) {
        schemaContent += `\n// =========================================\n`;
        schemaContent += `// ${moduleFile.replace('.prisma', '').toUpperCase().replace('-', ' ')}\n`;
        schemaContent += `// =========================================\n\n`;
        schemaContent += cleanContent;
        schemaContent += '\n';
        processedFiles++;
      }
    } else {
      console.warn(`⚠️  Module file ${moduleFile} not found - skipping`);
    }
  });
  
  // Write the combined schema
  fs.writeFileSync(OUTPUT_FILE, schemaContent);
  
  const totalLines = schemaContent.split('\n').length;
  console.log(`✅ Schema built successfully!`);
  console.log(`📊 Processed ${processedFiles} modules`);
  console.log(`📏 Total lines: ${totalLines}`);
  console.log(`💾 Output: ${OUTPUT_FILE}`);
}

// Clean module content - remove generator/datasource if present
function cleanModuleContent(content) {
  const lines = content.split('\n');
  const cleanLines = [];
  let skipBlock = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip generator and datasource blocks
    if (trimmed.startsWith('generator ') || trimmed.startsWith('datasource ')) {
      skipBlock = true;
      continue;
    }
    
    // End of block
    if (skipBlock && trimmed === '}') {
      skipBlock = false;
      continue;
    }
    
    // Skip lines inside generator/datasource blocks
    if (skipBlock) {
      continue;
    }
    
    cleanLines.push(line);
  }
  
  return cleanLines.join('\n').trim();
}

// Run the build
try {
  buildSchema();
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
