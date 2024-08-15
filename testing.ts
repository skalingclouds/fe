const countyResponse = await makeApiRequestWithRetry(url, countyPayload, headers, logging);
// Replacing axios with fetch

import fetch from 'node-fetch';

// Configuration
const API_URL = "https://api.realestateapi.com/v2/PropertySearch";
const API_KEY = "RMD-87a8-76eb-952d-3f35dc057092";

// Interfaces
interface OrCondition {
    city ? : string;
    county ? : string;
    property_type ? : string;
}

interface Condition {
    or ? : OrCondition[];
    [key: string]: any;
}

interface Payload {
    state ? : string;
    mls_active ? : boolean;
    mls_pending ? : boolean;
    mls_days_on_market_min ? : number;
    corporate_owned ? : boolean;
    reo ? : boolean;
    city ? : string;
    county ? : string;
    property_type ? : string;
    exclude ? : any;
    and ? : Condition[];
    summary ? : boolean;
    ids_only ? : boolean;
}

interface Summary {
    [key: string]: number;
}

interface CitySummary {
    location: string;
    summary: Summary;
}

interface ApiResponse {
    summary ? : Summary;
    ids ? : string[];
    error ? : any;
    errors ? : any[];
}

// Helper Functions
const makeApiRequest = async (payload: Payload): Promise < ApiResponse > => {
    try {
        console.log('Making API request with payload:', payload); // Debugging statement
        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`API request failed: ${errorDetails}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API request failed: ${error.message}`);
        throw error;
    }
};

const handleApiError = (response: ApiResponse): never => {
    if (response.error) {
        console.error("API Error:", JSON.stringify(response.error, null, 2));
    } else if (response.errors) {
        console.error("API Errors:", JSON.stringify(response.errors, null, 2));
    }
    throw new Error("API request failed");
};

const extractQueryParams = (payload: Payload): {
    cities: string[],
    counties: string[]
} => {
    const cities: string[] = [];
    const counties: string[] = [];

    if (payload.and && Array.isArray(payload.and)) {
        payload.and.forEach((condition: Condition) => {
            if (condition.or && Array.isArray(condition.or)) {
                condition.or.forEach((orCondition: OrCondition) => {
                    if (orCondition.city) {
                        cities.push(orCondition.city);
                    } else if (orCondition.county) {
                        counties.push(orCondition.county);
                    }
                });
            }
        });
    }

    return {
        cities,
        counties
    };
};

// Main Function
async function processPropertySearch(inputPayload: Payload) {
    const basePayload: Payload = {
        and: []
    };

    if (inputPayload.state) basePayload.state = inputPayload.state;
    if (inputPayload.mls_active !== undefined) basePayload.and!.push({
        mls_active: inputPayload.mls_active
    });
    if (inputPayload.mls_pending !== undefined) basePayload.and!.push({
        mls_pending: inputPayload.mls_pending
    });
    if (inputPayload.mls_days_on_market_min !== undefined) basePayload.and!.push({
        mls_days_on_market_min: inputPayload.mls_days_on_market_min
    });
    if (inputPayload.corporate_owned !== undefined) basePayload.and!.push({
        corporate_owned: inputPayload.corporate_owned
    });
    if (inputPayload.reo !== undefined) basePayload.and!.push({
        reo: inputPayload.reo
    });
    if (inputPayload.city) basePayload.and!.push({
        or: [{
            city: inputPayload.city
        }]
    });
    if (inputPayload.county) basePayload.and!.push({
        or: [{
            county: inputPayload.county
        }]
    });
    if (inputPayload.property_type) basePayload.and!.push({
        or: [{
            property_type: inputPayload.property_type
        }]
    });
    if (inputPayload.exclude) basePayload.exclude = inputPayload.exclude;

    console.log('Base Payload:', basePayload); // Debugging statement

    const queryParams = extractQueryParams(basePayload);

    // Summary query
    const summaryResponse = await makeApiRequest({
        ...basePayload,
        summary: true
    });
    console.log("Summary Query Response:", JSON.stringify(summaryResponse.summary, null, 2));

    // City and County Summaries
    const citySummaries: CitySummary[] = [];
    for (const city of queryParams.cities) {
        const cityPayload: Payload = {
            ...basePayload,
            and: basePayload.and!.filter(cond => !cond.or || !cond.or.some(orCond => 'city' in orCond)),
        };
        cityPayload.and!.push({
            city
        });
        cityPayload.summary = true;
        const cityResponse = await makeApiRequest(cityPayload);
        console.log(`Summary for ${city}:`, JSON.stringify(cityResponse.summary, null, 2));
        citySummaries.push({
            location: city,
            summary: cityResponse.summary!
        });
    }

    for (const county of queryParams.counties) {
        const countyPayload: Payload = {
            ...basePayload,
            and: basePayload.and!.filter(cond => !cond.or || !cond.or.some(orCond => 'county' in orCond)),
        };
        countyPayload.and!.push({
            county
        });
        countyPayload.summary = true;
        const countyResponse = await makeApiRequest(countyPayload);
        console.log(`Summary for ${county} County:`, JSON.stringify(countyResponse.summary, null, 2));
        citySummaries.push({
            location: `${county} County`,
            summary: countyResponse.summary!
        });
    }

    // IDs only query
    const idsResponse = await makeApiRequest({
        ...basePayload,
        ids_only: true
    });
    console.log("IDs Only Query Response:", JSON.stringify(idsResponse.ids, null, 2));

    // Return all relevant data as JSON
    return {
        summaryResponse,
        citySummaries,
        idsResponse,
    };
}

export {
    processPropertySearch,
    Payload
};