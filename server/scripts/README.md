# Scripts Directory

This directory contains utility scripts for the SQL competition platform.

## Available Scripts

### `hashPassword.js`

Password hashing utility for creating user accounts.

**Usage:**

```bash
npm run hash-password <password>
# or
node scripts/hashPassword.js <password>
```

**Example:**

```bash
npm run hash-password mypassword123
```



## Adding New Scripts

When adding new scripts:

1. Create the script file in this directory
2. Add a shebang line: `#!/usr/bin/env node`
3. Add proper error handling and logging
4. Update this README with usage instructions
5. Add npm script to `package.json` if needed

## Script Guidelines

- Use descriptive names
- Include proper error handling
- Add usage instructions in comments
- Use console.log for user feedback
- Exit with appropriate status codes
