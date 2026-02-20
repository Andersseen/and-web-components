# And Web Components

A modern, high-performance web component library built with [StencilJS](https://stenciljs.com/) and integrated into an [Angular](https://angular.io/) workspace. Tailored for flexibility, styling (TailwindCSS), and ease of use.

## 🚀 Features

- **Web Components**: Built with StencilJS, usable in any framework (React, Vue, Svelte, etc.) or plain HTML.
- **Angular Integration**: First-class Angular support with typed proxies.
- **TailwindCSS**: Styled with TailwindCSS for rapid UI development and easy customization.
- **Shadow DOM**: Encapsulated styles ensuring no conflicts with host applications.
- **Modern Architecture**: Monorepo structure managed with pnpm workspaces.

## 📂 Project Structure

```
and-web-components/
├── packages/
│   ├── stencil-library/       # The core Web Component library
│   │   ├── src/components/    # Source code for components (and-card, and-button, etc.)
│   │   └── stencil.config.ts  # Stencil configuration
│   └── angular-workspace/     # Angular demo application & wrapper library
│       ├── projects/
│       │   ├── angular-components/ # Generated Angular wrappers
│       │   └── demo-app/           # Showcase application
│       └── angular.json
├── package.json               # Root scripts and dependencies
└── pnpm-workspace.yaml        # Workspace configuration
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (`npm install -g pnpm`)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-username/and-web-components.git
    cd and-web-components
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

## 🏃‍♂️ Running locally

To start the demo application with live reload:

```bash
pnpm start:demo
```

This command will:

1.  Build the Stencil library in watch mode (optional, usually separate). _Note: The current script runs the Angular app. For development on components, you may want to run `pnpm build:stencil --watch` in a separate terminal._
2.  Serve the Angular demo app at `http://localhost:4200`.

## 🏗️ Building

To build the entire project (Stencil library + Angular wrappers + Demo App):

```bash
pnpm build:demo
```

The output artifacts will be located in:

- **Web Components**: `packages/stencil-library/dist/`
- **Angular Lib**: `packages/angular-workspace/dist/angular-components/`
- **Demo App**: `packages/angular-workspace/dist/demo-app/`

## 🚀 Deployment (Vercel)

This project is configured for easy deployment on Vercel.

**Recommended Settings:**

- **Root Directory**: `.` (Root)
- **Build Command**: `pnpm build:demo`
- **Output Directory**: `packages/angular-workspace/dist/demo-app/browser` (or just `dist/demo-app` depending on Angular version)
- **Install Command**: `pnpm install`

_Note: The included `vercel.json` handles routing rewrites for the Angular SPA._

## 🧩 Components

The library currently includes:

- **Accordion**: Collapsible content panels.
- **Button**: Customizable buttons with variants.
- **Card**: Content containers with header/content/footer.
- **Carousel**: Image/content slider.
- **Dropdown**: Menu overlays.
- **Icon**: SVG icon system.
- **Input**: Form inputs.
- **Modal**: Dialog overlays.
- **Navbar/Sidebar**: Navigation components.
- **Tabs**: Tabbed content switching.
- **Toast**: Notification messages.
- **Tooltip**: Info popups.

## 🎨 Styling

Components are styled using TailwindCSS within the Shadow DOM. Global styles (variables) are defined in `stencil-library/src/global/global.css`.

## 📄 License

MIT
