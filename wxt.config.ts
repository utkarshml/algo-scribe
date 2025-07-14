import { defineConfig } from 'wxt';
// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],

  manifest: ({ browser, manifestVersion, mode, command }) => {
    return {

      name: "algo-scribe",
      description: "Effortlessly capture, categorize, and revise your DSA solutions with AI-powered notes and personalized study plans—right from your browser!",
      author: "Utkarsh Jaiswal",
      version: "1.0.0",
      permissions: ["scripting", "sidePanel", "activeTab", "identity",   "tabs", "storage" ],
      "oauth2": {
        client_id: "741307501287-7mpuuhoicr348j1vqs9fo9q016ptdgil.apps.googleusercontent.com",
        scopes: ["openid", "email", "profile"]
      },
     web_accessible_resources: [
      {
        resources: ["injector.js"],
        matches: ["<all_urls>"]
      }
    ]
    };
  },
});
