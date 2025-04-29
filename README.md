<<<<<<< HEAD
# cincopa-strapi
=======
# 🎞️ Strapi Plugin: Cincopa Uploader

[![npm version](https://img.shields.io/npm/v/strapi-plugin-cincopa-uploader?color=blue)](https://www.npmjs.com/package/strapi-plugin-cincopa-uploader)
[![Strapi version](https://img.shields.io/badge/strapi-v5-blueviolet)](https://strapi.io)
[![License](https://img.shields.io/npm/l/strapi-plugin-cincopa-uploader.svg)](./LICENSE)
[![Downloads](https://img.shields.io/npm/dm/strapi-plugin-cincopa-uploader)](https://www.npmjs.com/package/strapi-plugin-cincopa-uploader)
[![GitHub issues](https://img.shields.io/github/issues/cincopa-com/strapi-plugin-cincopa-uploader)](https://github.com/cincopa-com/cincopa-strapi/issues)

A powerful Strapi plugin for uploading and managing media assets in **Cincopa** directly from the Strapi Admin Panel.

---

## ✨ Features

- 📤 Upload videos, images, and other assets to Cincopa
- 🔍 Search for assets by title or Cincopa Asset ID
- 🖝️ Link uploaded assets to custom collection types
- 🔄 Sync asset status automatically via Cincopa webhooks
- 🌐 Full Sync Mode for syncing all Cincopa assets

---

## 🛠️ Installation

This plugin is compatible with **Strapi v5**.

```bash
npm install strapi-plugin-cincopa-uploader@latest
```

---

## ⚙️ Configuration

After installation, configure the plugin based on your project setup.

### Plugin Setup

**JavaScript:**
```js
// ./config/plugins.js
module.exports = ({ env }) => ({
  'cincopa-uploader': {
    enabled: true,
    config: {
      apiToken: env('CINCOPA_API_TOKEN'),
      fullCincopaSync: false,
    },
  },
});
```

**TypeScript:**
```ts
// ./config/plugins.ts
export default ({ env }) => ({
  'cincopa-uploader': {
    enabled: true,
    config: {
      apiToken: env('CINCOPA_API_TOKEN'),
      fullCincopaSync: false,
    },
  },
});
```

**Environment Variable:**
```env
CINCOPA_API_TOKEN=your_actual_api_token_here
```

Restart the server after saving changes:

```bash
npm run develop
```

---

## 📢 Webhook Setup

Enable real-time synchronization by configuring a webhook in your Cincopa account.

- Go to your Cincopa Dashboard
- Create a new webhook
- Set the URL:

```
https://your-strapi-domain.com/api/cincopa-uploader/webhook
```

> Note: Webhook signature verification is currently **disabled** (may be added in future updates).

For local development, use [ngrok](https://ngrok.com/):
```bash
ngrok http 1337
```

Then set the ngrok public URL in the webhook configuration.

---

## 🌐 Full Sync Mode

If `fullCincopaSync` is set to `true`, the plugin will synchronize **all** assets in your Cincopa account, not only those uploaded via Strapi.

Modify in your plugin config:
```js
fullCincopaSync: true
```

---

## 📅 Usage

### Uploading Assets

- Navigate to **Cincopa Uploader** in the Strapi Admin Panel
- Upload via **file** or **remote URL**
- Uploaded media is linked to custom collection types easily

### Asset Management

- Create or update entries by associating uploaded Cincopa assets
- Example: Create an "IKEA Stores" collection type and attach video tours

### API Access

Enable public API access for your content:

- Go to **Settings > Roles > Public**
- Enable `find` and `findOne` permissions for your collection types

Fetch your data via:
```bash
curl http://localhost:1337/api/ikea-stores
```

Assets will appear with metadata, media URLs, and thumbnails.

---

## 💡 FAQ

**The plugin doesn't show in Admin UI?**

```bash
rm -rf .cache build
npm run build
npm run develop
```

**Webhooks don't work locally?**

Use ngrok or a similar tunneling tool.

---

## 💬 Support

For assistance, contact [support@cincopa.com](mailto:support@cincopa.com)

---

## 📄 License

[MIT](./LICENSE)
>>>>>>> master
