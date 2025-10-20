# Magic Neers - Modern Next.js Project

A modern, production-ready Next.js 15 application built with TypeScript, Tailwind CSS, and the latest web technologies.

## 🚀 Features

- **Next.js 15** with App Router and React Server Components
- **TypeScript** with strict configuration and modern features
- **Tailwind CSS 4** for utility-first styling
- **Turbopack** for lightning-fast development builds
- **ESLint & Prettier** for code quality and formatting
- **Modern project structure** with organized directories
- **Custom hooks** for common patterns (localStorage, debounce)
- **Reusable UI components** with TypeScript support
- **Type-safe utilities** and helper functions

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.6
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Linting**: ESLint 9 with TypeScript support
- **Formatting**: Prettier
- **Build Tool**: Turbopack (Next.js built-in)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # UI components
│   │   ├── button.tsx    # Button component
│   │   └── input.tsx     # Input component
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
│   ├── use-debounce.ts   # Debounce hook
│   └── use-local-storage.ts # LocalStorage hook
├── lib/                  # Utility functions
│   └── utils.ts          # Common utilities
├── types/                # TypeScript type definitions
│   └── index.ts          # Shared types
├── utils/                # Additional utilities
└── styles/               # Additional styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd magicneers-next
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts
- `npm run pre-commit` - Run all checks (type-check, lint, format)

## 🎨 UI Components

### Button Component

A versatile button component with multiple variants and sizes:

```tsx
import { Button } from '@/components/ui/button';

// Variants
<Button variant="default">Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// States
<Button loading>Loading</Button>
<Button disabled>Disabled</Button>
```

### Input Component

A form input component with label and error support:

```tsx
import { Input } from '@/components/ui/input';

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error="Invalid email format"
  helperText="We'll never share your email"
/>
```

## 🪝 Custom Hooks

### useLocalStorage

Persist state in localStorage with TypeScript support:

```tsx
import { useLocalStorage } from '@/hooks/use-local-storage';

const [name, setName, removeName] = useLocalStorage('user-name', '');
```

### useDebounce

Debounce values and callbacks:

```tsx
import { useDebounce } from '@/hooks/use-debounce';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 500);
```

## 🛠️ Configuration

### TypeScript

The project uses strict TypeScript configuration with modern features:

- `strict: true` - Enable all strict type checking options
- `noUncheckedIndexedAccess: true` - Add undefined to index signature results
- `exactOptionalPropertyTypes: true` - Interpret optional property types as written
- Path aliases for clean imports (`@/*`, `@/components/*`, etc.)

### ESLint

Configured with Next.js, TypeScript, and Prettier rules:

- Next.js core web vitals
- TypeScript recommended rules
- Prettier integration
- Custom rules for better code quality

### Prettier

Consistent code formatting with:

- Single quotes for strings
- Semicolons
- 2-space indentation
- 80 character line width
- Trailing commas

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The project can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- Render
- Self-hosted servers

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the pre-commit checks: `npm run pre-commit`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.