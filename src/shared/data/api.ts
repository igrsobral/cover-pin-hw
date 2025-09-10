import { API_ENDPOINTS, ERROR_MESSAGES, SIMULATION_CONFIG } from '../constants';

import type { Lead, Opportunity } from '../types';

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

  const response = await fetch(API_ENDPOINTS.LEADS);
  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.FETCH_LEADS_FAILED);
  }

  return response.json();
};

export const updateLead = async (
  leadId: string,
  updates: Partial<Lead>
): Promise<Lead> => {
  await simulateDelay();

  const leads = await fetchLeads();
  const leadIndex = leads.findIndex((lead) => lead.id === leadId);

  if (leadIndex === -1) {
    throw new Error(ERROR_MESSAGES.LEAD_NOT_FOUND);
  }

  const updatedLead = { ...leads[leadIndex], ...updates };
  return updatedLead;
};

export const fetchOpportunities = async (): Promise<Opportunity[]> => {
  await simulateDelay();

  const response = await fetch(API_ENDPOINTS.OPPORTUNITIES);
  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.FETCH_OPPORTUNITIES_FAILED);
  }

  return response.json();
};

export const createOpportunity = async (
  opportunity: Omit<Opportunity, 'id'>
): Promise<Opportunity> => {
  await simulateDelay();

  const newOpportunity: Opportunity = {
    ...opportunity,
    id: `opp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };

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
