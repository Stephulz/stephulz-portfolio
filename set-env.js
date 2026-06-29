const fs = require('fs');

// This script writes Vercel's environment variables into a normal TypeScript file
const targetPath = './src/app/env.ts';
const envConfigFile = `
export const environment = {  
  CONFIGCAT_SDK: '${process.env.CONFIGCAT_SDK || 'configcat-sdk-1/**********************/**********************'}'
};
`;

fs.writeFileSync(targetPath, envConfigFile);
console.log(`Environment variables generated at ${targetPath}`);