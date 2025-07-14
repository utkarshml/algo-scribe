import { createClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    monaco?: any;
  }
}
export  const supabase = createClient(
    'https://mfdavktxdkgecupbaqqi.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mZGF2a3R4ZGtnZWN1cGJhcXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NDQ4NjUsImV4cCI6MjA2NjUyMDg2NX0.P2nrSNv_kWhz2R9d_Z-K9-ydZJmqVCL7mqeSXe_oKHs'
  );

export default defineBackground(() => {

function parseUrlHash(url: string) {
  const hashParts = new URL(url).hash.slice(1).split('&');
  const hashMap = new Map(
    hashParts.map((part) => {
      const [name, value] = part.split('=');
      return [name, value];
    })
  );

  return hashMap;
}

async function finishUserOAuth(url: string) {
  try {
    console.log(`handling user OAuth callback ...`);

    // extract tokens from hash
    const hashMap = parseUrlHash(url);

    const access_token = hashMap.get('access_token');
    const refresh_token = hashMap.get('refresh_token');
    if (!access_token || !refresh_token) {
      throw new Error(`no supabase tokens found in URL hash`);
    }

    // check if they work
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) throw error;

    // persist session to storage
    await browser.storage.local.set({ session: data.session });

    // finally redirect to a post oauth page
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (tab.id !== undefined) {
      await browser.tabs.update(tab.id, { url: `chrome-extension://${browser.runtime.id}/options.html`});
      console.log(`finished handling user OAuth callback`);
    } else {
      console.error('Active tab id is undefined, cannot update tab.');
    }
  } catch (error) {
    console.error(error);
  }
}


browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url?.startsWith("http://localhost:3000/")) {
    finishUserOAuth(changeInfo.url);
  }
});


let cachedData : any = null;
//   // It use for extract user code from his leetcode editor 
browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//  if (msg.type === 'INJECT_MONACO_EXTRACTOR') {
//   if (sender.tab?.id !== undefined) {
//     browser.scripting.executeScript({
//       target: { tabId: sender.tab.id },
//       world: 'MAIN',
//       func: () => {
//         const poll = () => {
//           const models = window.monaco?.editor?.getModels?.();
//           if (models?.length > 0) {
//             const { code, language } = models[0];
//             window.postMessage({ source: 'monaco-extractor', type: 'LEETCODE_CODE', code, language }, '*');
//           } else {
//             console.log('Waiting for Monaco editor…');
//             setTimeout(poll, 500);
//           }
//         };
//         poll();
//       }
//     });
//   }
// }

  if (msg.type === 'OPEN_SIDE_PANEL') {
      chrome.sidePanel.open({tabId : msg.tabId})
      .then( async () => {
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
  if(msg.type === 'SCRAPED_DATA'){
   cachedData = msg.data
  }
  if(msg.type === 'GET_POPUP_DATA'){
    sendResponse({data : cachedData})
  }
  if(msg.type === 'SET_PAGE_INFO'){
    sendResponse({data : cachedData})
  }
});

});

