# Vega Providers

Community-maintained provider extensions for the Vega app. This repository contains provider modules, a manifest, build tooling, and automated tests.

## Requirements
- Node.js 20 or later
- npm

## Setup
```bash
git clone https://github.com/Sachin44512uu/vega-providers.git
cd vega-providers
npm ci
```

## Development commands
| Command | Purpose |
| --- | --- |
| `npm run build` | Bundle provider modules into `dist/` |
| `npm run build:dev` | Build without minification |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm test` | Run the provider integration test suite |
| `npm run test:provider -- <provider>` | Run the single-provider test runner |
| `npm run dev` | Start the local development server |
| `npm run watch` | Watch files using nodemon |

Integration tests may contact provider websites. Network availability and changes to those sites can affect results.

## Provider layout
Each provider lives in its own directory under `providers/`. Standard modules:
- `catalog.ts` — catalog sections and optional genre filters
- `posts.ts` — catalog and search results
- `meta.ts` — title metadata and available link groups
- `stream.ts` — handles media links supported by the provider
- `episodes.ts` — optional dynamic episode listing
- `settings.ts` — optional provider settings schema

Shared provider types are defined in `providers/types.ts`. Import core return types from the shared module.

Every provider directory needs a matching `manifest.json` entry. The manifest `value` must match the directory name and include a valid version. Use `disabled: true` when a provider should not be offered by default.

See [AGENTS.md](AGENTS.md) for detailed provider contracts and implementation conventions.

## Adding or updating a provider
1. Create or update one provider directory under `providers/`.
2. Follow the signatures and return shapes in `AGENTS.md`.
3. Update the matching `manifest.json` entry.
4. Run `npm ci`, `npm run typecheck`, `npm run build`, and `npm test`.
5. Review generated files in `dist/` before committing. Never commit secrets, session cookies, or personal account data.

Only integrate sources and media that you are authorized to access and distribute. Prefer official, licensed destinations and respect source-site terms, rate limits, and takedown requests.

## Continuous integration
GitHub Actions runs the TypeScript check, build, and provider test suite for pushes and pull requests to `main`. Scheduled and manual runs are also configured.

## Repository structure
```text
providers/       Provider source modules and shared types
tests/           Provider tests and test helpers
assets/          Provider artwork
dist/            Generated provider bundles
manifest.json    Provider registry and metadata
build-bundled.js Provider build script
```

## Contributing
Keep changes scoped to the relevant provider where possible. Preserve existing provider contracts, update tests when behavior changes, and summarize compatibility or source-site changes in pull requests.
