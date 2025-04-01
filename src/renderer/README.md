# CurateElectron Renderer

This directory contains the renderer process code for the CurateElectron application.

## Directory Structure

```
src/renderer/
├── features/           # Feature modules
│   ├── calendar/      # Calendar feature
│   ├── search/        # Search feature
│   ├── paper-entry/   # Paper entry feature
│   ├── date-entry/    # Date entry feature
│   ├── onboard/       # Onboarding feature
│   └── backfill/      # Backfill feature
├── core/              # Core application code
│   ├── components/    # Shared components
│   │   ├── common/    # Common UI components
│   │   └── layout/    # Layout components
│   ├── hooks/        # Shared React hooks
│   ├── utils/        # Shared utilities
│   ├── api/          # API clients
│   ├── store/        # State management
│   ├── styles/       # Global styles
│   ├── error/        # Error handling
│   ├── config/       # Configuration
│   ├── assets/       # Static assets
│   └── test-utils/   # Testing utilities
└── types/            # Global type definitions
```

## Feature Module Structure

Each feature module follows this structure:
```
features/feature-name/
├── components/       # Feature-specific components
├── hooks/           # Feature-specific hooks
├── utils/           # Feature-specific utilities
├── types.ts         # Feature-specific types
├── api.ts           # Feature-specific API calls
├── store.ts         # Feature-specific state
└── index.ts         # Main feature export
```

## Development Guidelines

1. Place feature-specific code in the appropriate feature directory
2. Use core/ for truly shared code
3. Follow the established naming conventions:
   - PascalCase for components
   - camelCase for utilities and hooks
   - kebab-case for CSS modules
4. Keep feature modules independent and self-contained
5. Use TypeScript for all new code
6. Write tests for new features 