import type { Lead, Opportunity } from '../types';

const SIMULATION_DELAY = { min: 300, max: 1000 };
const ERROR_RATE = 0.1;

const simulateDelay = () => {
  const delay =
    Math.random() * (SIMULATION_DELAY.max - SIMULATION_DELAY.min) +
    SIMULATION_DELAY.min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

const simulateError = () => {
  if (Math.random() < ERROR_RATE) {
    throw new Error('Simulated network error');
  }
};

export const fetchLeads = async (): Promise<Lead[]> => {
  await simulateDelay();
  simulateError();

  const response = await fetch('/data/leads.json');
  if (!response.ok) {
    throw new Error('Failed to fetch leads');
  }

  return response.json();
};

export const updateLead = async (
  leadId: string,
  updates: Partial<Lead>
): Promise<Lead> => {
  await simulateDelay();
  simulateError();

  const leads = await fetchLeads();
  const leadIndex = leads.findIndex((lead) => lead.id === leadId);

  if (leadIndex === -1) {
    throw new Error('Lead not found');
  }

  const updatedLead = { ...leads[leadIndex], ...updates };
  return updatedLead;
};

export const fetchOpportunities = async (): Promise<Opportunity[]> => {
  await simulateDelay();
  simulateError();

  const response = await fetch('/data/opportunities.json');
  if (!response.ok) {
    throw new Error('Failed to fetch opportunities');
  }

  return response.json();
};

export const createOpportunity = async (
  opportunity: Omit<Opportunity, 'id'>
): Promise<Opportunity> => {
  await simulateDelay();
  simulateError();

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
  simulateError();

  const updatedLead = await updateLead(leadId, { status: 'qualified' });
  const opportunity = await createOpportunity({
    ...opportunityData,
    leadId,
  });

  return { lead: updatedLead, opportunity };
};
