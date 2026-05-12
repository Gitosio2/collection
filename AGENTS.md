# Agent Instructions

These instructions apply to the entire repository.

## Communication and planning

- Communicate clearly and concisely in the language used by the requester unless instructed otherwise.
- Before implementing large changes, summarize the intended approach and identify assumptions.
- Prefer small, focused changes over broad rewrites.
- Keep project documentation updated when architectural or behavioral decisions change.
- When a requirement is ambiguous, ask for clarification before making irreversible design decisions.

## Required stack

- Use Next.js, TypeScript, PostgreSQL, Prisma, Tailwind CSS, shadcn/ui, and Cloudflare R2 unless the project owner explicitly approves a different choice.
- Prefer TypeScript-first libraries and patterns. Avoid introducing parallel frameworks or redundant infrastructure for problems already covered by the required stack.
- Keep implementation choices compatible with future multiuser, multicollection, and PWA support.

## Language, naming, and internationalization

- Write code identifiers, variable names, function names, class names, file names, commit messages, branch names, technical comments, and pull request titles in English.
- The initial user interface must be Spanish.
- Design UI text so it can be internationalized later; avoid hardcoding user-facing strings deep inside business logic or reusable infrastructure.
- Keep naming conventions consistent:
  - Use singular names for domain entities and Prisma models, such as `Item`, `Brand`, `Manufacturer`, `Company`, and `Collection`.
  - Use camelCase for TypeScript variables, functions, object properties, and Prisma fields.
  - Use PascalCase for React components, classes, types, interfaces, and Prisma models.
  - Use clear domain names from the documented model, such as `brandId`, `model`, `manufacturerId`, `companyId`, and `countryId`.
  - Do not reintroduce deprecated names such as `representedBrandId`, `representedModel`, `miniatureManufacturerId`, or `decorationCompanyId`.

## Architecture and design principles

- Apply SOLID principles throughout the codebase:
  - Single Responsibility Principle: each module, component, class, and function must have one clear reason to change.
  - Open/Closed Principle: prefer extension points and composition over modifying stable code for every new feature.
  - Liskov Substitution Principle: implementations must remain safely substitutable for their abstractions.
  - Interface Segregation Principle: keep interfaces, props, services, and contracts focused and minimal.
  - Dependency Inversion Principle: depend on abstractions for infrastructure concerns such as persistence, authentication, storage, and external APIs.
- Favor composition over inheritance.
- Keep domain logic separate from framework, UI, persistence, and external service integration code.
- Avoid duplicating business rules across client and server; centralize validation and domain rules where practical.
- Use Zod for request, form, and domain input validation. Share Zod schemas between forms and server-side validation whenever practical.
- Design features so future multiuser and multicollection support can be added without major schema or architecture rewrites.
- Keep authorization and ownership boundaries explicit; resources that can become user-owned or collection-owned must be modeled so future tenant isolation is straightforward.

## Security requirements

- Treat all user-controlled input as untrusted.
- Prevent SQL injection by using parameterized queries, ORM query builders, or prepared statements. Never concatenate raw user input into SQL.
- Prevent XSS by escaping or sanitizing user-generated content before rendering it. Avoid unsafe HTML rendering unless the input has been explicitly sanitized.
- Enforce authentication and authorization checks on the server side for protected resources.
- Never rely only on client-side checks for security-sensitive decisions.
- Validate and constrain uploaded files by MIME type, extension, size, and image dimensions before accepting them.
- Store passwords only as secure password hashes generated with a modern password hashing algorithm such as Argon2id or bcrypt. Never store plaintext passwords.
- Store secrets only in environment variables or secret managers. Never commit credentials, API keys, tokens, private keys, or production secrets.
- Avoid logging sensitive data such as passwords, tokens, session cookies, personal data, or signed upload URLs.
- Use secure defaults for cookies, sessions, CORS, headers, and file access.
- Protect state-changing operations against CSRF when cookie-based authentication is used.
- Check dependencies for known vulnerabilities before release and keep them updated.

## Data and database guidelines

- Use migrations for all schema changes.
- Keep database naming consistent with the documented model unless a migration plan is explicitly approved.
- Use foreign keys and indexes for relationships and common lookup paths.
- Preserve data integrity with database constraints where appropriate.
- Make destructive data changes explicit and reversible when possible.
- Do not store image binaries in the relational database. Store image metadata in the database and image files in the configured object storage provider.
- Keep catalogue data normalized while preserving fast creation flows in the UI.

## Image and object storage guidelines

- Use Cloudflare R2 as the primary object storage provider unless the project owner approves a change.
- Generate optimized image variants for web delivery when images are uploaded.
- Keep original images or highest-quality retained versions separate from optimized variants.
- Initial upload policy:
  - Accept high-quality source images up to a configurable hard limit; start with 50 MB per uploaded image unless implementation constraints require a lower limit.
  - Do not reject an image only because it is larger than 10 MB if it is within the configured hard limit.
  - Store the original or highest-quality retained file separately, preferably private in R2.
  - Recompress generated web variants for delivery; target each generated variant to be below 10 MB, and preferably much smaller for `medium` and `thumbnail` variants.
  - If a source image exceeds the hard limit, reject it with a clear validation message instead of attempting an unsafe or resource-heavy upload.
- Prefer modern delivery formats such as WebP or AVIF for generated variants when browser support and implementation complexity are acceptable.
- Store enough metadata to support deletion, replacement, ordering, cover image selection, and future migration to another S3-compatible provider.
- Do not expose private object keys or privileged storage credentials to the browser.

## Frontend guidelines

- Build responsive interfaces from the start.
- Keep components small, accessible, and reusable.
- Prefer semantic HTML and accessible controls.
- Use form validation that provides clear feedback, but enforce authoritative validation on the server.
- Use shared Zod schemas for form and server validation when practical.
- Avoid introducing global state unless the feature genuinely requires it.
- Optimize image loading in gallery and detail views by using thumbnails or medium variants where appropriate.

## Backend and API guidelines

- Keep API handlers thin; delegate business logic to services or domain modules.
- Validate request payloads at API boundaries with Zod.
- Return consistent error shapes and avoid leaking internal implementation details.
- Use least-privilege access for database, storage, and external service credentials.
- Make external integrations replaceable through adapters or service interfaces.

## Testing and quality

- Create test cases for all business logic.
- Add or update tests for behavior changes whenever practical.
- Cover business rules, validation, authorization, and critical data transformations.
- Choose the appropriate additional testing strategy for the change, such as unit, integration, API, component, accessibility, or end-to-end tests.
- Run relevant formatters, linters, type checks, and tests before committing.
- If a test or check cannot be run because of an environment limitation, document the limitation clearly.
- Do not ignore failing checks unless the reason is documented and accepted.

## Dependency policy

- Avoid unnecessary dependencies, especially for small utilities that can be implemented clearly with the standard library or existing project dependencies.
- Prefer well-maintained, widely adopted packages with active security support.
- Justify large, complex, or security-sensitive dependencies in the pull request description.
- Do not add dependencies that duplicate capabilities already provided by the required stack without explicit justification.
- Keep dependency versions updated through normal maintenance and security review.

## Git and review workflow

- Keep commits focused and descriptive.
- Do not rewrite shared history unless explicitly requested.
- Do not commit generated build artifacts, dependency folders, local environment files, or secrets.
- Include a clear summary and testing notes in pull request descriptions.
- Mention documentation updates when a change affects architecture, setup, or workflows.
