// config/email-domains.ts

interface DomainConfig {
  apiKey: string;
  name: string;
}

export const EMAIL_DOMAIN_CONFIG: Record<string, DomainConfig> = {
  [process.env.d1 || ""]: {
    apiKey: process.env.RESEND_API_KEY_TVA || "",
    name: "TVA",
  },
  [process.env.d2 || ""]: {
    apiKey: process.env.RESEND_API_KEY_JHT || "",
    name: "JHT",
  },
  [process.env.d4 || ""]: {
    apiKey: process.env.RESEND_API_KEY_ASUSU || "",
    name: "AsusuNG",
  },
  // Easy to add more domains:
  // [process.env.d3 || '']: {
  //   apiKey: process.env.RESEND_API_KEY_XYZ || '',
  //   name: 'XYZ'
  // },
};

export const getAllowedDomains = (): string[] => {
  return Object.keys(EMAIL_DOMAIN_CONFIG).filter(
    (domain) => domain && EMAIL_DOMAIN_CONFIG[domain].apiKey
  );
};

export const getDomainConfig = (domain: string): DomainConfig | undefined => {
  return EMAIL_DOMAIN_CONFIG[domain];
};

export const isValidDomain = (domain: string): boolean => {
  const config = getDomainConfig(domain);
  return !!(config && config.apiKey);
};
