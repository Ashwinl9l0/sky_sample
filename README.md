# Install dependencies

npm install

# or

yarn install

# for running

npm run dev

#
If given more time, here are some enhancements I would implement to improve the codebase and overall maintainability:

State Management:

Introduce Redux for better state handling, especially if the app scales further and needs more predictable state flows.

Data Visualization:

Replace the current graphing library with a more feature-rich one that supports panning, zooming, and downloading capabilities for a better user experience.

Testing:

Implement Vitest for unit testing to ensure component-level reliability and facilitate TDD (Test Driven Development).

Styling & Theming:

Use Material UI's custom theme to define and apply consistent styles across the app, including buttons and other UI components.

Move commonly used styles to a global SCSS file for better reusability and structure.

Extract all font and color variables into dedicated SCSS variable files to support multi-theme functionality and simplify future updates.

Code Structure & Maintainability:

Leverage the existing content.ts file to:

Store static values in a centralized location.

Define and export interfaces/types for static objects, improving type safety and developer clarity.
