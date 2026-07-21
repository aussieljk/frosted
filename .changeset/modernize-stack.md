---
'@aussieljk/frosted': minor
---

Modernize the toolchain and internals:

- Build with tsdown (rolldown) + TypeScript 7 — ESM (.mjs) and CJS outputs with per-format type declarations
- Migrate OTPField from input-otp and Sheet from vaul-base onto @base-ui/react equivalents
- Update react-aria/react-stately date-picker stack to latest (onChange now passes null instead of undefined for cleared values)
- All dependencies updated to latest majors
