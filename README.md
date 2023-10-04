# IQP Data Tools

This repository contains code written to help facilitate data collection and visualization during IQP. It uses the vite-vue-vuetify stack, and firebase for a backend. 

### Goals
- Provide a convienient way to do observatinoal data collection during IQP
- Provide visualizations of that data
- Public facing version of the app for consumtion by those who would read a Executive Summary
- Centralize data from multiple sources
- Provide simple utilities like tracking QRCode locations

### Non-Goals
- Replace existing tools such as ArcGIS, Qualtrics, etc.
- Act as a one-size fits all solution for multiple projects (projects should copy and extend this code as needed)

## Generating icons

```
npx pwa-asset-generator icon.svg ./public -b "linear-gradient(to right top, #0f126a, #333791)" -w -f -i index.html
```

## Project setup

```
# yarn
yarn

# npm
npm install

# pnpm
pnpm install
```

### Compiles and hot-reloads for development

```
# yarn
yarn dev

# npm
npm run dev

# pnpm
pnpm dev
```

### Compiles and minifies for production

```
# yarn
yarn build

# npm
npm run build

# pnpm
pnpm build
```

### Lints and fixes files

```
# yarn
yarn lint

# npm
npm run lint

# pnpm
pnpm lint
```
