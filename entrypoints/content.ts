import { leetcodeData } from "@/types/custom";
import { Heart } from "lucide-react";
export default defineContentScript({
  matches: ["<all_urls>"],

  main(ctx) {


    window.addEventListener('message', (event) => {
      if (event.data?.type === 'SUPABASE_LOGIN') {
        browser.runtime.sendMessage({ type: "SUPABASE_LOGIN", token: event.data.token });
        chrome.storage.local.set({ supabaseToken: event.data.token });
      }
    });

    function getLeetCodeInfo(): leetcodeData {
      const data: leetcodeData = {
        question: "No Question Loaded",
        description: "No Description Loaded",
        language: "c++"
      }
      const questionTitleElement = document.querySelector('.text-title-large');
      const medium = document.getElementsByClassName("text-difficulty-medium")
      const easy = document.getElementsByClassName("text-difficulty-easy")
      const hard = document.getElementsByClassName("text-difficulty-hard");
      if (easy.length > 0) {
        data.difficulty = "Easy";
      } else if (hard.length > 0) {
        data.difficulty = "Hard";
      } else if (medium.length > 0) {
        data.difficulty = "Medium";
      } else {
        data.difficulty = "No Difficulty Found";
      }

      const questionTitle = questionTitleElement && (questionTitleElement as HTMLElement).innerText || "No question title found";
      const questionDescription = (document.querySelectorAll('.elfjS')[0] as HTMLElement).innerText || "No question description found";
      data.question = questionTitle
      data.description = questionDescription
      return data
    }
    function getGFGInfo(): Promise<leetcodeData> {
      return new Promise((resolve) => {
        const data: leetcodeData = {
          question: "No Question Loaded",
          description: "No Description Loaded",
          language: "c++",
          code: ""
        };

        const observer = new MutationObserver(() => {
          const descriptionElement = document.getElementsByClassName("undefined");

          if (
            descriptionElement &&
            descriptionElement[2] &&
            descriptionElement[2].childNodes.length >= 4 &&
            document.querySelector('.ace_text-layer') !== null &&
            (document.querySelector('.ace_text-layer') as HTMLElement).innerText != ""
          ) {
            try {
              const question = (descriptionElement[2].childNodes[0].childNodes[0].childNodes[0] as HTMLElement).innerText;
              const description = (descriptionElement[2].childNodes[3] as HTMLElement).innerText;
              const difficultyElement = descriptionElement[2].childNodes[1].childNodes[0].childNodes[1] as HTMLElement;
              const difficulty = difficultyElement.innerText
              const dropdown = document.querySelector('div[role="listbox"]');
              const selectedItem = dropdown?.querySelector('[role="option"][aria-selected="true"] .text');
              const selectedLanguage = selectedItem?.textContent?.trim() || "c++";
              const aceEditor = Array.from(document.querySelectorAll('.ace_text-layer')) as HTMLElement[];
              data.question = question;
              data.description = description;
              data.language = selectedLanguage;
              data.code = aceEditor[0].innerText;
              data.difficulty = difficulty;

              observer.disconnect();
              resolve(data);
            } catch (e) {
              console.warn("Error while extracting GFG data:", e);
            }
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      });
    }

    const leetcodeDataSetter = () => {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('injector.js');
      script.onload = () => script.remove();
      document.documentElement.appendChild(script);

      // Listen for the extracted code message
      window.addEventListener('message', function handler(event) {
        if (event.source === window && event.data?.type === 'LEETCODE_CODE') {
          window.removeEventListener('message', handler);
          const data = getLeetCodeInfo();
          data.code = event.data.code;
          data.language = event.data.language;
          browser.runtime.sendMessage({ type: 'SCRAPED_DATA', data });
        }
      });
    }
    const gfgcodeDataSetter = () => {
      getGFGInfo().then((data) => {
        browser.runtime.sendMessage({ type: "SCRAPED_DATA", data }, (res) => {
          console.log("Message Sucessfully send to Background")
        });
      })
    }


    let debounceTimer: ReturnType<typeof setTimeout>;

    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (
          window.location.host === 'leetcode.com' &&
          window.location.pathname.startsWith('/problems')
        ) {
          leetcodeDataSetter();
        } else if (
          window.location.host === 'www.geeksforgeeks.org' &&
          window.location.pathname.startsWith('/problems')
        ) {
          gfgcodeDataSetter();
        } else {
          observer.disconnect();
        }
      }, 300);
    });

    observer.observe(document.body, { childList: true, subtree: true });

  },
});
