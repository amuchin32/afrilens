import { useEffect, useState } from "react";
import API from "../services/api";

let cache = null;

export default function useSocialLinks() {
  const [links, setLinks] = useState(cache || {});
  useEffect(() => {
    if (cache) { setLinks(cache); return; }
    API.get("/settings/social")
      .then(r => { cache = r.data?.links || {}; setLinks(cache); })
      .catch(() => {});
  }, []);
  return links;
}
