import { defineConfig } from 'wxt';
// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],

  manifest: ({ browser, manifestVersion, mode, command }) => {
    return {

      name: "algo-scribe",
      description: "DSA solutions with AI-powered notes ",
      author: "Utkarsh Jaiswal",
      version: "1.0.2",
      permissions: ["scripting", "sidePanel", "activeTab","tabs", "storage" ],
      "oauth2": {
        client_id: "741307501287-7mpuuhoicr348j1vqs9fo9q016ptdgil.apps.googleusercontent.com",
        scopes: ["openid", "email", "profile"]
      },
      host_permissions: ["<all_urls>"],
      web_accessible_resources: [
      {
        resources: ["injector.js"],
        matches: ["<all_urls>"]
      }
    ]
    };
  },
});
