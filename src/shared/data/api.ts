import { API_ENDPOINTS, ERROR_MESSAGES, SIMULATION_CONFIG } from '../constants';

import type { Lead, Opportunity } from '../types';

let leadsCache: Lead[] | null = null;
let opportunitiesCache: Opportunity[] | null = null;

const simulateDelay = () => {
  const delay =
    Math.random() *
      (SIMULATION_CONFIG.DELAY.MAX - SIMULATION_CONFIG.DELAY.MIN) +
    SIMULATION_CONFIG.DELAY.MIN;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

// const simulateError = () => {
//   if (Math.random() < SIMULATION_CONFIG.ERROR_RATE) {
//     throw new Error(ERROR_MESSAGES.SIMULATED_ERROR);
//   }
// };

export const fetchLeads = async (): Promise<Lead[]> => {
  await simulateDelay();

  if (leadsCache) {
    return leadsCache;
  }

  const response = await fetch(API_ENDPOINTS.LEADS);
  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.FETCH_LEADS_FAILED);
  }

  const leads = await response.json();
  leadsCache = leads;
  return leads;
};

export const updateLead = async (
  leadId: string,
  updates: Partial<Lead>
): Promise<Lead> => {
  await simulateDelay();

  if (!leadsCache) {
    await fetchLeads();
  }

  const leadIndex = leadsCache!.findIndex((lead) => lead.id === leadId);
  if (leadIndex === -1) {
    throw new Error(ERROR_MESSAGES.LEAD_NOT_FOUND);
  }

  const updatedLead = { ...leadsCache![leadIndex], ...updates };
  leadsCache![leadIndex] = updatedLead;

  return updatedLead;
};

export const fetchOpportunities = async (): Promise<Opportunity[]> => {
  await simulateDelay();

  if (opportunitiesCache) {
    return opportunitiesCache;
  }

  const response = await fetch(API_ENDPOINTS.OPPORTUNITIES);
  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.FETCH_OPPORTUNITIES_FAILED);
  }

  const opportunities = await response.json();
  opportunitiesCache = opportunities;
  return opportunities;
};

export const createOpportunity = async (
  opportunity: Omit<Opportunity, 'id'>
): Promise<Opportunity> => {
  await simulateDelay();

  if (!opportunitiesCache) {
    await fetchOpportunities();
  }

  const newOpportunity: Opportunity = {
    ...opportunity,
    id: `opp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };

  opportunitiesCache!.push(newOpportunity);

  return newOpportunity;
};

export const convertLeadToOpportunity = async (
  leadId: string,
  opportunityData: {
    name: string;
    stage: Opportunity['stage'];
    amount?: number;
    accountName: string;
  }
): Promise<{ lead: Lead; opportunity: Opportunity }> => {
  await simulateDelay();

  const updatedLead = await updateLead(leadId, { status: 'qualified' });
  const opportunity = await createOpportunity({
    ...opportunityData,
    leadId,
  });

  return { lead: updatedLead, opportunity };
};
