import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const ROOTS = ['src', 'electron'];
const TEST_PATTERN = /\.(test|spec)\.[^.]+$/;

function hasTestsInDir(dirPath) {
  const entries = readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (hasTestsInDir(fullPath)) {
        return true;
      }
      continue;
    }

    if (entry.isFile() && TEST_PATTERN.test(entry.name)) {
      return true;
    }
  }

  return false;
}

function projectHasTests() {
  for (const root of ROOTS) {
    try {
      if (hasTestsInDir(root)) {
        return true;
      }
    } catch {
      continue;
    }
  }

  return false;
}

if (!projectHasTests()) {
  console.log('[ci-test-gate] No test files (*.test.* / *.spec.*) found in src/ or electron/.');
  console.log(
    '[ci-test-gate] Test contract is in place; skipping test runner until suite is added.'
  );
  process.exit(0);
}

console.log('[ci-test-gate] Test files detected. Running: npm run test -- --run');
const result = spawnSync('npm', ['run', 'test', '--', '--run'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
