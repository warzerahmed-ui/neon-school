# Project Guidance

## User Preferences

- Neon visual style (نیۆن) across the whole app: dark near-black background with glowing cyan/magenta accents
- Kurdish-language interface
- Login page first, with a protected dashboard behind it

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- With [canisters.backend.migrations] check-limit=1, at most one migration may be pending; fold an earlier pending migration's fields into the latest pending file and delete the older pending file.
- OQL auto-derivation needs a top-level <Type>Value import per primitive field type; a record field of type ?Nat needs a custom module exporting `_toRow : ?Nat -> OQL.Value` (sentinel #nat(0) for null).
- getApiDoc must live in its own mixin file as a bare top-level `mixin () { ... }` returning the Markdown directly; a top-level `let` in a mixin is stable state and traps at runtime.
- TanStack Router 1.131.50: createRouter({ routeTree }) works without an explicit history; createRootRoute/createRoute/Outlet/Navigate/RouterProvider all export from @tanstack/react-router.
- core-infrastructure 2.0.0 exposes useInternetIdentity() with isAuthenticated, isInitializing, isLoggingIn, isLoginError, loginError, login(), clear(); use isAuthenticated for guards.
- Backend bigint fields (DashboardStats totals, Class.studentCount) must be converted with Number() before arithmetic or rendering.
- Sonner's Toaster must be mounted once in App.tsx; AlertDialogAction closes on click by default, so call event.preventDefault() when the confirm action is async.
- pnpm fix (biome check --write) reorders imports and reformats files; run it before typecheck/build.
