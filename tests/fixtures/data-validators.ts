import type {
  LeadStatus,
  OpportunityStage,
  TestLead,
  TestOpportunity,
} from './test-data';

export class DataValidators {
  static validateLead(lead: unknown): lead is TestLead {
    return (
      typeof lead === 'object' &&
      lead !== null &&
      typeof (lead as Record<string, unknown>).id === 'string' &&
      typeof (lead as Record<string, unknown>).name === 'string' &&
      typeof (lead as Record<string, unknown>).company === 'string' &&
      typeof (lead as Record<string, unknown>).email === 'string' &&
      typeof (lead as Record<string, unknown>).source === 'string' &&
      typeof (lead as Record<string, unknown>).score === 'number' &&
      this.isValidLeadStatus((lead as Record<string, unknown>).status) &&
      ((lead as Record<string, unknown>).score as number) >= 0 &&
      ((lead as Record<string, unknown>).score as number) <= 100
    );
  }

  static validateOpportunity(
    opportunity: unknown
  ): opportunity is TestOpportunity {
    return (
      typeof opportunity === 'object' &&
      opportunity !== null &&
      typeof (opportunity as Record<string, unknown>).id === 'string' &&
      typeof (opportunity as Record<string, unknown>).name === 'string' &&
      typeof (opportunity as Record<string, unknown>).stage === 'string' &&
      typeof (opportunity as Record<string, unknown>).accountName ===
        'string' &&
      ((opportunity as Record<string, unknown>).amount === undefined ||
        typeof (opportunity as Record<string, unknown>).amount === 'number') &&
      ((opportunity as Record<string, unknown>).leadId === undefined ||
        typeof (opportunity as Record<string, unknown>).leadId === 'string')
    );
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidLeadStatus(status: unknown): status is LeadStatus {
    return ['new', 'contacted', 'qualified', 'unqualified'].includes(
      status as string
    );
  }

  static isValidOpportunityStage(stage: unknown): stage is OpportunityStage {
    return [
      'Discovery',
      'Qualification',
      'Proposal',
      'Negotiation',
      'Closed Won',
      'Closed Lost',
    ].includes(stage as string);
  }

  static validateLeadArray(leads: unknown[]): TestLead[] {
    const validLeads: TestLead[] = [];
    const errors: string[] = [];

    leads.forEach((lead, index) => {
      if (this.validateLead(lead)) {
        validLeads.push(lead);
      } else {
        errors.push(`Invalid lead at index ${index}: ${JSON.stringify(lead)}`);
      }
    });

    if (errors.length > 0) {
      console.warn('Lead validation errors:', errors);
    }

    return validLeads;
  }

  static validateOpportunityArray(opportunities: unknown[]): TestOpportunity[] {
    const validOpportunities: TestOpportunity[] = [];
    const errors: string[] = [];

    opportunities.forEach((opportunity, index) => {
      if (this.validateOpportunity(opportunity)) {
        validOpportunities.push(opportunity);
      } else {
        errors.push(
          `Invalid opportunity at index ${index}: ${JSON.stringify(opportunity)}`
        );
      }
    });

    if (errors.length > 0) {
      console.warn('Opportunity validation errors:', errors);
    }

    return validOpportunities;
  }

  static validateJsonStructure(jsonString: string): {
    isValid: boolean;
    data?: unknown;
    error?: string;
  } {
    try {
      const data = JSON.parse(jsonString);
      return { isValid: true, data };
    } catch (error) {
      return {
        isValid: false,
        error:
          error instanceof Error ? error.message : 'Unknown JSON parsing error',
      };
    }
  }

  static generateValidationReport(
    leads: TestLead[],
    opportunities: TestOpportunity[]
  ): {
    leadsReport: {
      total: number;
      valid: number;
      invalid: number;
      statusDistribution: Record<LeadStatus, number>;
      scoreDistribution: { min: number; max: number; average: number };
    };
    opportunitiesReport: {
      total: number;
      valid: number;
      invalid: number;
      stageDistribution: Record<string, number>;
      amountStats: {
        withAmount: number;
        withoutAmount: number;
        totalValue: number;
      };
    };
  } {
    // Leads analysis
    const statusDistribution: Record<LeadStatus, number> = {
      new: 0,
      contacted: 0,
      qualified: 0,
      unqualified: 0,
    };

    let totalScore = 0;
    let minScore = 100;
    let maxScore = 0;

    leads.forEach((lead) => {
      statusDistribution[lead.status]++;
      totalScore += lead.score;
      minScore = Math.min(minScore, lead.score);
      maxScore = Math.max(maxScore, lead.score);
    });

    // Opportunities analysis
    const stageDistribution: Record<string, number> = {};
    let withAmount = 0;
    let withoutAmount = 0;
    let totalValue = 0;

    opportunities.forEach((opportunity) => {
      stageDistribution[opportunity.stage] =
        (stageDistribution[opportunity.stage] || 0) + 1;

      if (opportunity.amount !== undefined) {
        withAmount++;
        totalValue += opportunity.amount;
      } else {
        withoutAmount++;
      }
    });

    return {
      leadsReport: {
        total: leads.length,
        valid: leads.length, // Assuming all passed leads are valid
        invalid: 0,
        statusDistribution,
        scoreDistribution: {
          min: leads.length > 0 ? minScore : 0,
          max: leads.length > 0 ? maxScore : 0,
          average: leads.length > 0 ? Math.round(totalScore / leads.length) : 0,
        },
      },
      opportunitiesReport: {
        total: opportunities.length,
        valid: opportunities.length, // Assuming all passed opportunities are valid
        invalid: 0,
        stageDistribution,
        amountStats: {
          withAmount,
          withoutAmount,
          totalValue,
        },
      },
    };
  }
}
