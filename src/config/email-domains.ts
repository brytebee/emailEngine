// config/email-domains.ts
import { getDomains } from "@/lib/googleSheetsDomains";
import { decrypt } from "@/lib/encryption";

interface DomainConfig {
  apiKey: string;
  name: string;
}

let cachedDomains: Record<string, DomainConfig> | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes cache

export const clearDomainCache = () => {
  cachedDomains = null;
  lastFetchTime = 0;
};

async function fetchAndCacheDomains() {
  const now = Date.now();
  // Return cached result if valid
  if (cachedDomains && now - lastFetchTime < CACHE_TTL) {
    return cachedDomains;
  }

  const config: Record<string, DomainConfig> = {};

  try {
    const domains = await getDomains();
    for (const d of domains) {
      if (d.encryptedKey) {
        config[d.domain] = {
          apiKey: decrypt(d.encryptedKey),
          name: d.domain,
        };
      }
    }
    
    // Fallback to existing environment variables to not break current deployments
    if (process.env.d1 && process.env.RESEND_API_KEY_TVA && !config[process.env.d1]) {
      config[process.env.d1] = { apiKey: process.env.RESEND_API_KEY_TVA, name: "TVA" };
    }
    if (process.env.d2 && process.env.RESEND_API_KEY_JHT && !config[process.env.d2]) {
      config[process.env.d2] = { apiKey: process.env.RESEND_API_KEY_JHT, name: "JHT" };
    }
    if (process.env.d4 && process.env.RESEND_API_KEY_ASUSU && !config[process.env.d4]) {
      config[process.env.d4] = { apiKey: process.env.RESEND_API_KEY_ASUSU, name: "AsusuNG" };
    }

    cachedDomains = config;
    lastFetchTime = now;
    return config;
  } catch (error) {
    console.error("Failed to fetch domains from Google Sheets:", error);
    if (cachedDomains) return cachedDomains;

    // Last resort fallback
    if (process.env.d1) config[process.env.d1] = { apiKey: process.env.RESEND_API_KEY_TVA || "", name: "TVA" };
    if (process.env.d2) config[process.env.d2] = { apiKey: process.env.RESEND_API_KEY_JHT || "", name: "JHT" };
    if (process.env.d4) config[process.env.d4] = { apiKey: process.env.RESEND_API_KEY_ASUSU || "", name: "AsusuNG" };
    return config;
  }
}

export const getAllowedDomains = async (): Promise<string[]> => {
  const config = await fetchAndCacheDomains();
  return Object.keys(config).filter((domain) => config[domain].apiKey);
};

export const getDomainConfig = async (domain: string): Promise<DomainConfig | undefined> => {
  const config = await fetchAndCacheDomains();
  return config[domain];
};

export const isValidDomain = async (domain: string): Promise<boolean> => {
  const config = await getDomainConfig(domain);
  return !!(config && config.apiKey);
};
