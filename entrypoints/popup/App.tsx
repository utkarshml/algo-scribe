import { useCallback, useEffect, useState } from "react";
import "./style.css";
import { Button } from "@/components/ui/button";
import { FileText, LayoutDashboard, LogOutIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Auth from "@/components/Auth";
import { supabase } from "../background";
import { Session } from "@supabase/supabase-js";

function IndexPopup() {
  const [pageInfo, setPageInfo] = useState({ question: '', description: '', language: '', code: '' });
  const [tabId, setTabId] = useState<number | null | undefined>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Get current tab ID
  useEffect(() => {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setTabId(tabs[0]?.id);
    });
  }, []);
  


  // Request question data from background script
  useEffect(() => {
    function requestData(retries = 5) {
      browser.runtime.sendMessage({ type: "GET_POPUP_DATA" }, (response) => {
        const data = response?.data;
        if (data) {
          setPageInfo(prev => ({
            ...prev,
            question: data.question,
            description: data.description,
          }));
        } else if (retries > 0) {
          setTimeout(() => requestData(retries - 1), 500);
        } else {
          console.log("No data fetched");
        }
      });
    }
    requestData();
  }, []);

  
  // Restore session from browser local storage
  useEffect(() => {
    async function fetchSession() {
      try {
        const { supabaseToken } = await browser.storage.local.get('supabaseToken');
        if (supabaseToken) {
          const { error } = await supabase.auth.setSession(supabaseToken);
          if (!error) {
            setSession(supabaseToken);
          } else {
            console.error("Supabase session error:", error);
          }
        }
      } catch (err) {
        console.error("Session fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
 
  }, []);
  // Button handlers
  const handleNote = useCallback(() => {
    if (!tabId) return;
    browser.runtime.sendMessage({ type: 'OPEN_SIDE_PANEL', tabId, action: "gen_note" });
    window.close();
  }, [tabId]);


  const signOut = useCallback(async () => {
  browser.tabs.create({ url: import.meta.env.VITE_ALGO_BASE_URL + '/logout' });
    window.close();
  }, []);

  // Render loader while session is being restored
  if (loading) {
    return (
      <div className="p-2 w-80 bg-[rgb(23,22,22)] shadow-lg rounded-lg">
        <Card className="border-0 shadow-none ">
          <div className="p-4">
            <Loader />
          </div>
        </Card>
      </div>
    );
  }

  // Render login UI if no session
  if (!session) {
    return <Auth />;
  }

  // Render main popup content
  return (
    <div className=" w-80  bg-[rgb(23,22,22)] shadow-lg rounded-lg">
      <Card className="border-0 shadow-none ">
        <div className="p-4 space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg text-white font-bold">{session.user.user_metadata?.full_name || "User"}</h2>
            <Button onClick={signOut} className=" cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <LogOutIcon />
            </Button>
          </div>

          <Separator className="bg-[rgb(85,85,85)]" />

          {/* Question Title */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Question
            </h3>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
              {pageInfo.question || "No question found (Reload the page)"}
            </p>
          </div>

          <Separator className="bg-[rgb(85,85,85)]" />

          {/* Action Buttons */}
          <div className="flex gap-2 items-center">
            <Button
              onClick={handleNote}
              className="justify-start gap-3 cursor-pointer h-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
            >
              <FileText className="h-4 w-4" />
              Generate Note
            </Button>

         <a target="_blank" href="https://algo-gray.vercel.app/auth">
            <Button
              variant="outline"
              className="justify-start gap-3 text-white cursor-pointer h-10 border-purple-200 hover:bg-purple-50 hover:border-purple-300 dark:border-purple-700 dark:hover:bg-purple-900/30"
            >

              <LayoutDashboard className="h-4 w-4 text-purple-600" />
              Dashboard
            </Button>
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Loader Component
export function Loader() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="animate-spin rounded-full h-6 w-6 border-4 border-purple-500 border-t-transparent"></div>
    </div>
  );
}

export default IndexPopup;
