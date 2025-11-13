import axios from "axios";
import cache from "../utils/cache.js";

// Parliament API endpoints
const findMpUrl = "https://members-api.parliament.uk/api/Location/Constituency/Search";
const mpContactUrl = "https://members-api.parliament.uk/api/Members";

// Normalize postcode
const normalizePostcode = (postcode) => {
  if (!postcode) return null;
  return postcode.toUpperCase().replace(/\s+/g, "");
};

// Main service
export const getMPDetails = async (postcode) => {
  const normalized = normalizePostcode(postcode);
  const cacheKey = `mp-${normalized}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    // 1️⃣ Get constituency by postcode
    const constituencyRes = await axios.get(findMpUrl, {
      params: { searchText: normalized },
      timeout: 10000,
    });

    const items = constituencyRes.data?.items;
    if (!items?.length) return null;

    const memberObj = items[0].value?.currentRepresentation?.member?.value;
    if (!memberObj || !memberObj.id) return null;

    const memberId = memberObj.id;

    // 2️⃣ Get MP contact details
    const contactUrl = `${mpContactUrl}/${memberId}/Contact`;

    let email = null;
    try {
      const contactRes = await axios.get(contactUrl, { timeout: 10000 });
      const contacts = contactRes.data?.value || [];

      // Find email
      for (let c of contacts) {
        if (c.email) {
          email = c.email;
          break;
        }
      }

      // Fallback to telecom
      if (!email && contactRes.data?.telecom?.length) {
        const t = contactRes.data.telecom.find((x) => x.type?.toLowerCase() === "email");
        if (t?.value) email = t.value;
      }
    } catch (err) {
      console.warn("⚠️ Contact fetch failed:", err.message);
    }

    const result = {
      name: memberObj.nameDisplayAs || memberObj.nameListAs || memberObj.nameFullTitle || "Unknown",
      party: memberObj.latestParty?.name || "Unknown",
      constituency: items[0].value?.name || "Unknown",
      email: email || "Not available",
    };

    // Cache 24 hours
    cache.set(cacheKey, result, 24 * 60 * 60 * 1000);

    return result;
  } catch (err) {
    console.error("❌ getMPDetails error:", err.message);
    return { name: "Unknown", party: "Unknown", constituency: "Unknown", email: "Not available" };
  }
};
