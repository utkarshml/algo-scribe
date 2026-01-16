import { createClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    monaco?: any;
  }
}
export const supabase = createClient(

  import.meta.env.VITE_ALGO_SUPA_URL,
  import.meta.env.VITE_ALGO_SUPA_PROJECT
);


export default defineBackground(() => {

  let cachedData: any = null;
  browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'OPEN_SIDE_PANEL') {
      chrome.sidePanel.open({ tabId: msg.tabId })
        .then(async () => {
          //   await  chrome.sidePanel.setOptions({
          //   tabId: msg.tabId,
          //   path: 'sidepanel.html',
          //   enabled: true
          // })
          cachedData["action"] = msg.action;
          return true;
        }).catch((error) => {
          console.error("Error opening side panel:", error);
          return false
        });
    }
    if (msg.type === 'SCRAPED_DATA') {
      cachedData = msg.data
    }
    if (msg.type === 'GET_POPUP_DATA') {
      sendResponse({ data: cachedData })
    }
    if (msg.type === 'SET_PAGE_INFO') {
      sendResponse({ data: cachedData })
    }
    if (msg?.type === 'SUPABASE_LOGIN') {
      chrome.storage.local.set({ supabaseToken: msg.token });
    }
  })
});
