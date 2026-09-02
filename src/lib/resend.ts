import { Resend } from "resend";

const getResend = () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        throw new Error("RESEND_API_KEY environment variable is missing");
    }
    return new Resend(apiKey);
};

export interface ResendDomainConfig {
    id: string;
    domain: string;
    records: any[];
    status: string;
}

/**
 * Registers a new domain with Resend to get DNS records
 */
export async function registerDomainWithResend(domainName: string): Promise<ResendDomainConfig> {
    const resend = getResend();
    
    const { data, error } = await resend.domains.create({
        name: domainName,
    });

    if (error) {
        throw new Error(`Resend domain creation failed: ${error.message}`);
    }

    if (!data) {
        throw new Error("Resend domain creation returned no data");
    }

    return {
        id: data.id,
        domain: domainName,
        records: data.records || [],
        status: data.status || 'pending'
    };
}

/**
 * Retrieves the verification status and records for a domain
 */
export async function getResendDomain(domainId: string) {
    const resend = getResend();
    const { data, error } = await resend.domains.get(domainId);
    
    if (error) {
        throw new Error(`Failed to fetch Resend domain: ${error.message}`);
    }
    
    return data;
}

/**
 * Triggers a verification check for a domain in Resend
 */
export async function verifyResendDomain(domainId: string) {
    const resend = getResend();
    const { data, error } = await resend.domains.verify(domainId);
    
    if (error) {
        throw new Error(`Domain verification trigger failed: ${error.message}`);
    }
    
    return data;
}

/**
 * Deletes a domain from Resend
 */
export async function removeDomainFromResend(domainId: string) {
    const resend = getResend();
    const { data, error } = await resend.domains.remove(domainId);
    
    if (error) {
        throw new Error(`Failed to remove Resend domain: ${error.message}`);
    }
    
    return data;
}
