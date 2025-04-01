# 🎞️ Strapi Plugin: Cincopa Uploader

[![npm version](https://img.shields.io/npm/v/strapi-plugin-cincopa-uploader?color=blue)](https://www.npmjs.com/package/strapi-plugin-cincopa-uploader)
[![Strapi version](https://img.shields.io/badge/strapi-v5-blueviolet)](https://strapi.io)
[![License](https://img.shields.io/npm/l/strapi-plugin-cincopa-uploader.svg)](./LICENSE)
[![Downloads](https://img.shields.io/npm/dm/strapi-plugin-cincopa-uploader)](https://www.npmjs.com/package/strapi-plugin-cincopa-uploader)
[![GitHub issues](https://img.shields.io/github/issues/cincopa-com/strapi-plugin-cincopa-uploader)](https://github.com/cincopa-com/strapi-plugin-cincopa-uploader/issues)

A Strapi plugin for managing asset uploads to **Cincopa** — including both direct file uploads and uploading via URL.

---

## ✨ Features

- 📤 Upload assets to Cincopa from inside Strapi (via file or URL)
- 🔍 Search for assets by **title** or **Cincopa Asset ID**
- 🗑️ Delete assets in Strapi, which also removes them from Cincopa ( soon )
- 🔄 Automatically sync asset status via **Cincopa webhooks**

---

## 🛠️ Installation

This plugin is compatible with **Strapi v5**.

```bash
npm install strapi-plugin-cincopa-uploader@latest
```

---

## ⚙️ Configuration

This plugin uses **Strapi's File-Based Configuration**. You must configure it via code — not the Admin UI.

### 🔑 Requirements

- A **Cincopa account**
- A **Cincopa API Token** with **"Full Access"** permissions
- A **Webhook Signing Secret** (from the Cincopa dashboard)

### 🔧 TypeScript Example

```ts
// Path: ./config/plugins.ts
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

### 🔧 JavaScript Example

```js
// Path: ./config/plugins.js
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

> ✅ Tested with Strapi **v5.0.6 Community Edition**

#### 🧩 About `fullCincopaSync`

The `fullCincopaSync` config option controls whether Strapi should automatically import **all Cincopa assets**, not just the ones uploaded through Strapi.

- If set to `false` (default): Only assets uploaded via Strapi are stored locally.
- If set to `true`: **All assets uploaded to your Cincopa account**, regardless of source, will be synced to Strapi automatically when webhook events are received.

---

## 🪝 Webhook Setup

> ⚠️ Webhook signature verification is currently disabled due to limitations in Koa (used by Strapi) — which prevents access to the raw request body. This may be added in a future update.

To sync asset status from Cincopa:

1. Go to your **Cincopa Dashboard**
2. Create a new webhook
3. Set the "URL to notify" as:

```
https://your-strapi-domain.com/api/cincopa-uploader/webhook
```

> Replace `your-strapi-domain.com` with your actual, publicly accessible Strapi base URL.

---

## 🧠 FAQ

### 💡 The plugin doesn't show up in the Admin UI?

You likely need to rebuild the admin panel:

```bash
rm -rf .cache .strapi build
npm run build
npm run develop
```

---

### 🌐 I’m developing locally without a public URL — how do I receive webhooks?

Use a tunneling service such as:

- [Ngrok](https://ngrok.com/)
- [Smee.io](https://smee.io/)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [Tailscale](https://tailscale.com/)

This will allow you to receive real-time webhook requests from Cincopa while developing locally.

---

## 💬 Support

For help or questions, contact [support@cincopa.com](mailto:support@cincopa.com)

---

## 📄 License

[MIT](./LICENSE)