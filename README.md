# TungTung Store

An e-commerce website template for a computer and gadget store. The UI is responsive across TV, desktop, tablet, and mobile (Android/iOS), with a modern theme and animations.

> **Status: still in development.** Some features are not 100% finished. See [Feature status](#feature-status) below.

## Want a website like this?

This site is a design and development template. If you want a website built in this style, contact:

**faathir.kuspratama.pasha36@gmail.com**

This contact is for website design and development requests only, not for buying store products.

## Tech stack

- **HTML** - single-page layout with page sections toggled in JavaScript
- **CSS** - `style.css` (base layout) and `modern.css` (modern theme, animations, responsive rules)
- **JavaScript** - vanilla JS, no build step and no dependencies
- **PHP + MySQL** - optional backend for the guestbook and user registration

## Project structure

```
StoreTemplate/
├── README.md
└── website/
    ├── index/index.html      # main page and all page sections
    ├── style/
    │   ├── style.css         # base layout
    │   └── modern.css        # modern theme, animations, responsive
    ├── js/script.js          # navigation, cart, search, mobile menu
    ├── img/                  # product images, banners, icons
    └── php/                  # optional backend
        ├── koneksi.php       # database connection
        ├── auth.php          # user registration
        ├── simpan.php        # guestbook / comments
        └── logout.php        # session logout
```

## Getting started

### Frontend only (no PHP needed)

Open `website/index/index.html` in a browser. Navigation, product pages, cart, search, and the mobile menu work without a server.

Note: the guestbook form posts to PHP, so it needs a server to store comments.

### With the PHP backend (optional)

The PHP files need a web server with PHP and MySQL.

1. Serve the folder with a local server, for example XAMPP or `php -S localhost:8000`.
2. Import the database. `php/koneksi.php` expects a database named `tungtung_store` on `localhost` with user `root` and no password. Adjust those values for your setup.
3. Create the tables used by the backend:

   ```sql
   CREATE DATABASE IF NOT EXISTS tungtung_store;

   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       nama VARCHAR(100) NOT NULL,
       email VARCHAR(100) NOT NULL,
       password VARCHAR(255) NOT NULL
   );

   CREATE TABLE buku_tamu (
       id INT AUTO_INCREMENT PRIMARY KEY,
       nama VARCHAR(100) NOT NULL,
       email VARCHAR(100) NOT NULL,
       komentar TEXT NOT NULL
   );
   ```

## Features

- **Responsive layout** - breakpoints for TV (1600px+), laptop, tablet (960px), phone (600px), and small phone (360px)
- **Modern theme** - gradient accents, rounded cards, glass sticky header
- **Animations** - hero zoom, page transitions, card hover effects, cart badge bump, and scroll reveal (disabled automatically when the OS has reduced motion enabled)
- **Navigation** - dropdown menus on desktop, tap accordions on touch devices, collapsible mobile menu
- **Product pages** - category pages and product detail pages
- **Search** - filters product cards by name
- **Shopping cart** - add items, change quantity, remove items, and checkout flow saved in `localStorage`
- **Account (demo)** - login and register stored in the browser only
- **Guestbook** - comment form (requires the PHP backend)
- **Contact section** - "Jasa Website" page for website development enquiries

## Feature status

| Feature | Status |
| --- | --- |
| Responsive layout | Done |
| Modern theme and animations | Done |
| Navigation and mobile menu | Done |
| Product, category, and detail pages | Done |
| Search | Done |
| Shopping cart and checkout | In progress - cart is stored in the browser only |
| Login / register | In progress - demo only, not connected to a real login |
| Guestbook | In progress - needs the PHP backend and database |
| Payment | Not started - checkout is a simulation, no real payment gateway |
| Order history | Not started - orders are not saved |
| Checkout form validation | In progress - fields are not fully validated |

Things that are known to be unfinished:

- Product cards in the template use placeholder names that do not always match the product photos.
- Login and register only pretend to log in; there is no real authentication or password security.
- The cart is per-browser. There is no server-side cart, stock check, or order record.
- Payment is a mock flow, and no payment provider is integrated.
- The guestbook only works if the PHP backend and database are set up.
- Shop address, phone, and opening hours are dummy placeholders.

## Notes for developers

- `modern.css` must be loaded after `style.css`, since it overrides the base styles.
- If the site suddenly looks old or unstyled, check that `style/modern.css` still exists.
- All navigation goes through `navigate(pageId)` in `js/script.js`, and each target must be a `<div id="..." class="page">`.
- Page sections use IDs in the Indonesian naming of the original template (for example `HKeranjang` for the cart page). These names are kept so they stay consistent with the rest of the project.

## License

Template for personal and educational use.
