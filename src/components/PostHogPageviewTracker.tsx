import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { capture } from "@/lib/posthog";

function PostHogPageviewTracker() {
  const location = useLocation();

  useEffect(() => {
    capture("$pageview");
  }, [location.pathname]);

  return null;
}

export default PostHogPageviewTracker;
