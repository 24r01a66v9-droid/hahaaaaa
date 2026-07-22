#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, name) {
  if (fs.existsSync(filePath)) {
    log('green', `✓ ${name}`);
    return true;
  } else {
    log('red', `✗ ${name}`);
    return false;
  }
}

function checkDirectory(dirPath, name) {
  if (fs.existsSync(dirPath)) {
    log('green', `✓ ${name} directory`);
    return true;
  } else {
    log('red', `✗ ${name} directory`);
    return false;
  }
}

async function checkServer(port, name) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/api/health`, (res) => {
      if (res.statusCode === 200) {
        log('green', `✓ ${name} is running on port ${port}`);
        resolve(true);
      } else {
        log('red', `✗ ${name} returned status ${res.statusCode}`);
        resolve(false);
      }
    });
    req.on('error', () => {
      log('red', `✗ ${name} is not running on port ${port}`);
      resolve(false);
    });
    req.setTimeout(3000);
  });
}

async function runChecks() {
  console.clear();
  log('blue', '═══════════════════════════════════════════════════════');
  log('blue', '   Analytics Dashboard - Installation Verification');
  log('blue', '═══════════════════════════════════════════════════════\n');

  // Check project files
  log('blue', '📁 Checking Project Files...');
  const files = [
    { path: 'server.js', name: 'Backend Server' },
    { path: 'app.js', name: 'React App' },
    { path: 'config.js', name: 'Database Config' },
    { path: 'package.json', name: 'Frontend Package' },
    { path: 'dashboard.sql', name: 'Database Schema' },
    { path: '.env.example', name: 'Environment Template' },
  ];

  let filesOk = true;
  files.forEach(({ path: filePath, name }) => {
    if (!checkFile(filePath, name)) filesOk = false;
  });

  // Check directories
  log('blue', '\n📂 Checking Directories...');
  const dirs = [
    { path: 'components', name: 'Components' },
    { path: 'styles', name: 'Styles' },
    { path: 'public', name: 'Public' },
    { path: 'server', name: 'Server' },
  ];

  let dirsOk = true;
  dirs.forEach(({ path: dirPath, name }) => {
    if (!checkDirectory(dirPath, name)) dirsOk = false;
  });

  // Check components
  log('blue', '\n⚛️  Checking React Components...');
  const components = [
    { path: 'components/Dashboard.js', name: 'Dashboard' },
    { path: 'components/SalesChart.js', name: 'SalesChart' },
    { path: 'components/KPIMonitor.js', name: 'KPIMonitor' },
    { path: 'components/RevenueChart.js', name: 'RevenueChart' },
    { path: 'components/CustomerChart.js', name: 'CustomerChart' },
    { path: 'components/ReportExport.js', name: 'ReportExport' },
  ];

  let componentsOk = true;
  components.forEach(({ path: compPath, name }) => {
    if (!checkFile(compPath, name)) componentsOk = false;
  });

  // Check stylesheets
  log('blue', '\n🎨 Checking CSS Files...');
  const styles = [
    { path: 'styles/App.css', name: 'App' },
    { path: 'styles/Dashboard.css', name: 'Dashboard' },
    { path: 'styles/SalesChart.css', name: 'SalesChart' },
    { path: 'styles/KPIMonitor.css', name: 'KPIMonitor' },
    { path: 'styles/ReportExport.css', name: 'ReportExport' },
  ];

  let stylesOk = true;
  styles.forEach(({ path: stylePath, name }) => {
    if (!checkFile(stylePath, name)) stylesOk = false;
  });

  // Check node_modules
  log('blue', '\n📦 Checking Dependencies...');
  if (fs.existsSync('node_modules')) {
    log('green', '✓ Frontend dependencies installed');
  } else {
    log('yellow', '⚠ Run: npm install');
  }

  // Check .env
  log('blue', '\n⚙️  Checking Configuration...');
  if (fs.existsSync('.env')) {
    log('green', '✓ .env file exists');
  } else {
    log('yellow', '⚠ Create .env file (copy from .env.example)');
  }

  // Check servers
  log('blue', '\n🚀 Checking Running Servers...');
  log('yellow', 'Note: Start both servers for this check to pass');
  const backendOk = await checkServer(5000, 'Backend Server');
  const frontendOk = await checkServer(3000, 'Frontend Server');

  // Summary
  log('blue', '\n═══════════════════════════════════════════════════════');
  log('blue', 'Summary:');
  log('blue', '═══════════════════════════════════════════════════════');

  const checks = [
    { name: 'Project Files', ok: filesOk },
    { name: 'Directories', ok: dirsOk },
    { name: 'Components', ok: componentsOk },
    { name: 'Stylesheets', ok: stylesOk },
  ];

  checks.forEach(({ name, ok }) => {
    log(ok ? 'green' : 'red', `${ok ? '✓' : '✗'} ${name}`);
  });

  if (!backendOk) log('yellow', '⚠ Backend server not running');
  if (!frontendOk) log('yellow', '⚠ Frontend server not running');

  const allOk = filesOk && dirsOk && componentsOk && stylesOk;

  log('blue', '\n═══════════════════════════════════════════════════════');
  if (allOk) {
    log('green', '✓ Installation verified! Ready to run.');
    log('green', '\nNext steps:');
    log('green', '1. npm install (if not already done)');
    log('green', '2. Create .env file from .env.example');
    log('green', '3. Run: npm start (Terminal 1)');
    log('green', '4. Run: npm start (Terminal 2)');
    log('green', '5. Open: http://localhost:3000');
  } else {
    log('red', '✗ Some files are missing. Check the output above.');
  }

  log('blue', '═══════════════════════════════════════════════════════\n');
}

runChecks().catch(console.error);