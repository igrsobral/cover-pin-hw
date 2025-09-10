import {
  type TestLead,
  type TestOpportunity,
  TestDataGenerator,
} from './test-data';

// Mock data files that simulate the actual JSON files the app would load
export class MockDataFiles {
  static createLeadsJsonFile(leads: TestLead[]): string {
    return JSON.stringify(leads, null, 2);
  }

  static createOpportunitiesJsonFile(opportunities: TestOpportunity[]): string {
    return JSON.stringify(opportunities, null, 2);
  }

  static createEmptyLeadsFile(): string {
    return JSON.stringify([], null, 2);
  }

  static createEmptyOpportunitiesFile(): string {
    return JSON.stringify([], null, 2);
  }

  static createCorruptedJsonFile(): string {
    return '{ "invalid": json, "missing": quotes }';
  }

  static createLargeLeadsFile(): string {
    const leads = TestDataGenerator.generateTestLeads(100);
    return JSON.stringify(leads, null, 2);
  }

  static createLeadsFileWithMissingFields(): string {
    const leads = [
      {
        id: '1',
        name: 'Incomplete Lead',
        // Missing required fields like email, company, etc.
      },
    ];
    return JSON.stringify(leads, null, 2);
  }

  static createLeadsFileWithInvalidData(): string {
    const leads = [
      {
        id: '1',
        name: 'Invalid Lead',
        company: 'Test Company',
        email: 'not-an-email',
        source: 'Website',
        score: 'not-a-number', // Invalid score type
        status: 'invalid-status', // Invalid status
      },
    ];
    return JSON.stringify(leads, null, 2);
  }

  // Utility methods for creating test data files in different formats
  static createTestDataSet(
    scenario: 'small' | 'medium' | 'large' | 'performance'
  ): {
    leads: string;
    opportunities: string;
  } {
    let leadCount: number;
    let opportunityCount: number;

    switch (scenario) {
      case 'small':
        leadCount = 5;
        opportunityCount = 2;
        break;
      case 'medium':
        leadCount = 25;
        opportunityCount = 8;
        break;
      case 'large':
        leadCount = 50;
        opportunityCount = 15;
        break;
      case 'performance':
        leadCount = 100;
        opportunityCount = 25;
        break;
      default:
        leadCount = 10;
        opportunityCount = 3;
    }

    const leads = TestDataGenerator.generateTestLeads(leadCount);
    const leadIds = leads.map((lead) => lead.id);
    const opportunities = TestDataGenerator.generateTestOpportunities(
      opportunityCount,
      leadIds
    );

    return {
      leads: this.createLeadsJsonFile(leads),
      opportunities: this.createOpportunitiesJsonFile(opportunities),
    };
  }
}
