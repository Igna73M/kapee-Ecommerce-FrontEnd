# Kapee-Ecommerce

A modern, responsive e-commerce website built with React, TypeScript, Vite, and Tailwind CSS. This project is a feature-rich clone of a professional press/electronics store layout, designed for learning, customization, and real-world use.

## Features

- **Responsive Design**: Fully mobile-friendly and adapts to all device sizes.
- **Modern UI**: Clean, attractive interface using Tailwind CSS and custom components.
- **Product Catalog**: Browse products by category, with detailed product cards and modals.
- **Cart System**: Add, remove, and update product quantities in a persistent cart.
- **Wishlist**: Like products and manage your wishlist, with real-time header updates.
- **Category Sidebar**: Hover to reveal categorized submenus for fast navigation.
- **Toast Notifications**: User feedback for cart and wishlist actions.
- **Reusable Components**: Modular UI (buttons, cards, menus, dialogs, etc.) for easy extension.
- **TypeScript**: Full type safety for robust development.
- **Vite**: Fast development and build tooling.

## Project Structure

```
├── public/                # Static assets
├── src/
│   ├── assets/            # Images and icons
│   ├── components/        # UI and layout components
│   ├── data/              # Product/category data
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Main page components (Home, Shop, Blog, etc.)
│   ├── types/             # TypeScript types
│   └── App.tsx            # Main app entry
├── tailwind.config.ts     # Tailwind CSS config
├── vite.config.ts         # Vite config
├── package.json           # Project metadata and scripts
└── README.md              # Project documentation
```

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) to view the site.

## Customization

- **Add/Edit Products:** Modify `src/data/products.ts` and `src/data/categorizedData.ts`.
- **Change Branding:** Update logo, colors, and text in `src/components/Header.tsx` and `tailwind.config.ts`.
- **UI Components:** Reuse or extend components in `src/components/ui/` for new features.

## Tech Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## License

This project is for educational and demonstration purposes. Feel free to use, modify, and share.

# kapee-Ecommerce
