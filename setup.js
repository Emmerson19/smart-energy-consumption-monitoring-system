#!/usr/bin/env node

/**
 * Smart Energy Monitor - Quick Setup Script
 * This script helps you get the application running quickly
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Smart Energy Monitor - Quick Setup');
console.log('=====================================\n');

// Check if we're in the right directory
if (!existsSync('frontend/package.json')) {
    console.error('❌ Error: Please run this script from the project root directory');
    process.exit(1);
}

console.log('📦 Installing frontend dependencies...');
try {
    execSync('cd frontend && npm install', { stdio: 'inherit' });
    console.log('✅ Frontend dependencies installed\n');
} catch (error) {
    console.error('❌ Failed to install frontend dependencies');
    process.exit(1);
}

console.log('🎭 Setting up demo mode...');
const envPath = 'frontend/.env';
let envContent = '';

if (existsSync(envPath)) {
    envContent = readFileSync(envPath, 'utf8');
}

// Ensure demo mode is enabled
if (!envContent.includes('VITE_USE_MOCK_DATA=true')) {
    if (envContent && !envContent.endsWith('\n')) {
        envContent += '\n';
    }
    envContent += '\n# Demo Mode Enabled\nVITE_USE_MOCK_DATA=true\n';
    writeFileSync(envPath, envContent);
}

console.log('✅ Demo mode configured\n');

console.log('🎉 Setup complete! You can now:');
console.log('');
console.log('1. Start the development server:');
console.log('   cd frontend && npm run dev');
console.log('');
console.log('2. Open your browser to: http://localhost:3000');
console.log('');
console.log('3. Login with demo credentials:');
console.log('   Email: demo@example.com');
console.log('   Password: demo123');
console.log('');
console.log('📖 For production setup, see README.md');
console.log('');
console.log('Happy monitoring! ⚡');