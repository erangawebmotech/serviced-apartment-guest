## [v2.1.0] - 2025-12-23
### Updated
- next ^16.0.7 to : ^16.1.1
- react ^19.2.1 to ^19.2.3
- react-dom ^19.2.1 to ^19.2.3

## [v2.0.2-beta.1] - 2025-12-15
### Updated
- change middleware route handling to proxy route

## [v2.0.1-beta.1] - 2025-12-15
### Updated
- change running port

## [v2.0.0-beta.1] - 2025-12-08
### Updated

- Next.js upgraded from v15.3.1 to v16.0.7
- React upgraded from v19.1.0 to v19.2.1
- React DOM upgraded from v19.1.0 to v19.2.1
- ESLint upgraded from v8 to v9 for full compatibility with Next 16
- Typescript ESLint updated to v8.48.1
- Babel presets updated to latest patch versions
- UI-related packages (@radix-ui/*, react-day-picker, etc.) updated for React 19 support

### Changed

- Replaced next lint usage with direct eslint CLI in package.json
- Migrated away from outdated or incompatible packages, including:
- @next/bundle-analyzer
- @next/third-parties
- @studio-freight/react-lenis (replaced with native lenis)
- gapi-script, html2canvas, and other unused dependencies
- Cleaned up old TypeScript type definitions incompatible with React 19
- Removed redundant legacy config files and simplified tooling

### Removed

- Legacy ESLint 8 configurations not supported by ESLint 9
- Deprecated Next.js 15 utilities and build-time tools
- Unused dependencies identified during the upgrade

## [v1.0.4] - 2025-12-08
### Updated
- Patch version upgrade

## [v1.0.3] - 2025-11-25
### Included
- v1.0.3-beta.1

## [v1.0.3-beta.1] - 2025-11-25
### Changed
- Updated “0 Reviews” to “Not rated yet”.
- Single Property View: replaced guest message with “Select your rooms” and enabled/disabled button based on guest count.
- Improved room bed display using icons.

## [v1.0.2] - 2025-11-24
### Fixed
- Fix Hotel Amenities, Highlights Overlap in Single Property View.
### Changed
- Update default days count from 1 -> 3 when redirecting to the filter page from Explore Our Properties on the landing page.

## [v1.0.1-beta.1] - 2025-11-24
### Fixed
- Fix Hotel Name Overlap in Property Card.

## [v1.0.0]
### Added
- live website v1
