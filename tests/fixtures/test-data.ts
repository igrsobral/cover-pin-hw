export interface TestLead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  createdAt?: string;
  updatedAt?: string;
}

export interface TestOpportunity {
  id: string;
  name: string;
  stage: string;
  amount?: number;
  accountName: string;
  leadId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type LeadStatus = TestLead['status'];
export type OpportunityStage =
  | 'Discovery'
  | 'Qualification'
  | 'Proposal'
  | 'Negotiation'
  | 'Closed Won'
  | 'Closed Lost';

// Comprehensive test lead dataset with realistic data
export const testLeads: TestLead[] = [
  {
    id: '1',
    name: 'John Doe',
    company: 'Acme Corp',
    email: 'john.doe@acme.com',
    source: 'Website',
    score: 85,
    status: 'new',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    company: 'Tech Solutions Inc',
    email: 'jane.smith@techsolutions.com',
    source: 'Referral',
    score: 92,
    status: 'contacted',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    company: 'Global Industries LLC',
    email: 'bob.johnson@global.com',
    source: 'Cold Call',
    score: 78,
    status: 'qualified',
    createdAt: '2024-01-13T16:45:00Z',
    updatedAt: '2024-01-17T11:30:00Z',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    company: 'Innovation Labs',
    email: 'sarah.wilson@innovationlabs.com',
    source: 'Social Media',
    score: 67,
    status: 'unqualified',
    createdAt: '2024-01-12T08:15:00Z',
    updatedAt: '2024-01-18T13:45:00Z',
  },
  {
    id: '5',
    name: 'Michael Chen',
    company: 'Digital Dynamics',
    email: 'michael.chen@digitaldynamics.com',
    source: 'Email Campaign',
    score: 89,
    status: 'new',
    createdAt: '2024-01-11T12:00:00Z',
    updatedAt: '2024-01-11T12:00:00Z',
  },
];

export const testOpportunities: TestOpportunity[] = [
  {
    id: '1',
    name: 'Acme Corp Enterprise Deal',
    stage: 'Proposal',
    amount: 50000,
    accountName: 'Acme Corp',
    leadId: '1',
    createdAt: '2024-01-16T10:30:00Z',
    updatedAt: '2024-01-16T10:30:00Z',
  },
  {
    id: '2',
    name: 'Tech Solutions Integration Project',
    stage: 'Negotiation',
    amount: 75000,
    accountName: 'Tech Solutions Inc',
    leadId: '2',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  },
  {
    id: '3',
    name: 'Global Industries Consulting',
    stage: 'Discovery',
    accountName: 'Global Industries LLC',
    leadId: '3',
    createdAt: '2024-01-18T11:30:00Z',
    updatedAt: '2024-01-18T11:30:00Z',
  },
];

// Data generation utilities for performance testing
export class TestDataGenerator {
  private static readonly FIRST_NAMES = [
    'John',
    'Jane',
    'Bob',
    'Sarah',
    'Michael',
    'Emily',
    'David',
    'Lisa',
    'Chris',
    'Amanda',
    'James',
    'Jessica',
    'Robert',
    'Ashley',
    'William',
    'Brittany',
    'Richard',
    'Samantha',
    'Thomas',
    'Jennifer',
    'Charles',
    'Elizabeth',
    'Daniel',
    'Megan',
    'Matthew',
    'Nicole',
  ];

  private static readonly LAST_NAMES = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
    'Hernandez',
    'Lopez',
    'Gonzalez',
    'Wilson',
    'Anderson',
    'Thomas',
    'Taylor',
    'Moore',
    'Jackson',
    'Martin',
    'Lee',
    'Perez',
    'Thompson',
    'White',
    'Harris',
    'Sanchez',
  ];

  private static readonly COMPANY_PREFIXES = [
    'Global',
    'Tech',
    'Digital',
    'Innovation',
    'Advanced',
    'Premier',
    'Elite',
    'Dynamic',
    'Strategic',
    'Integrated',
    'Smart',
    'Future',
    'Next',
    'Pro',
    'Ultra',
    'Mega',
    'Super',
  ];

  private static readonly COMPANY_SUFFIXES = [
    'Corp',
    'Inc',
    'LLC',
    'Solutions',
    'Systems',
    'Technologies',
    'Enterprises',
    'Industries',
    'Group',
    'Partners',
    'Associates',
    'Consulting',
    'Services',
    'Labs',
    'Works',
    'Dynamics',
  ];

  private static readonly SOURCES = [
    'Website',
    'Referral',
    'Cold Call',
    'Social Media',
    'Email Campaign',
    'Trade Show',
    'Partner',
    'Advertisement',
    'Content Marketing',
    'Webinar',
    'Direct Mail',
    'LinkedIn',
  ];

  private static readonly STATUSES: LeadStatus[] = [
    'new',
    'contacted',
    'qualified',
    'unqualified',
  ];

  private static readonly OPPORTUNITY_STAGES: OpportunityStage[] = [
    'Discovery',
    'Qualification',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost',
  ];

  static generateTestLeads(count: number): TestLead[] {
    const leads: TestLead[] = [];

    for (let i = 1; i <= count; i++) {
      const firstName = this.getRandomItem(this.FIRST_NAMES);
      const lastName = this.getRandomItem(this.LAST_NAMES);
      const companyPrefix = this.getRandomItem(this.COMPANY_PREFIXES);
      const companySuffix = this.getRandomItem(this.COMPANY_SUFFIXES);

      const name = `${firstName} ${lastName}`;
      const company = `${companyPrefix} ${companySuffix}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '')}.com`;

      leads.push({
        id: i.toString(),
        name,
        company,
        email,
        source: this.getRandomItem(this.SOURCES),
        score: this.generateScore(),
        status: this.getRandomItem(this.STATUSES),
        createdAt: this.generateRandomDate(),
        updatedAt: this.generateRandomDate(),
      });
    }

    return leads;
  }

  static generateTestOpportunities(
    count: number,
    leadIds?: string[]
  ): TestOpportunity[] {
    const opportunities: TestOpportunity[] = [];

    for (let i = 1; i <= count; i++) {
      const companyPrefix = this.getRandomItem(this.COMPANY_PREFIXES);
      const companySuffix = this.getRandomItem(this.COMPANY_SUFFIXES);
      const company = `${companyPrefix} ${companySuffix}`;

      opportunities.push({
        id: i.toString(),
        name: `${company} ${this.getRandomOpportunityType()}`,
        stage: this.getRandomItem(this.OPPORTUNITY_STAGES),
        amount: this.generateAmount(),
        accountName: company,
        leadId: leadIds ? this.getRandomItem(leadIds) : undefined,
        createdAt: this.generateRandomDate(),
        updatedAt: this.generateRandomDate(),
      });
    }

    return opportunities;
  }

  static generatePerformanceTestData(): {
    leads: TestLead[];
    opportunities: TestOpportunity[];
  } {
    const leads = this.generateTestLeads(100);
    const leadIds = leads.map((lead) => lead.id);
    const opportunities = this.generateTestOpportunities(25, leadIds);

    return { leads, opportunities };
  }

  static generateLeadWithStatus(status: LeadStatus): TestLead {
    const leads = this.generateTestLeads(1);
    return { ...leads[0], status };
  }

  static generateLeadWithScore(score: number): TestLead {
    const leads = this.generateTestLeads(1);
    return { ...leads[0], score };
  }

  static generateLeadWithInvalidEmail(): TestLead {
    const leads = this.generateTestLeads(1);
    return { ...leads[0], email: 'invalid-email-format' };
  }

  static generateOpportunityFromLead(lead: TestLead): TestOpportunity {
    return {
      id: `opp-${lead.id}`,
      name: `${lead.company} Deal`,
      stage: 'Discovery',
      amount: this.generateAmount(),
      accountName: lead.company,
      leadId: lead.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private static getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private static generateScore(): number {
    // Generate scores with realistic distribution (more leads in 60-90 range)
    const random = Math.random();
    if (random < 0.1) return Math.floor(Math.random() * 30); // 0-29 (10%)
    if (random < 0.3) return Math.floor(Math.random() * 30) + 30; // 30-59 (20%)
    if (random < 0.8) return Math.floor(Math.random() * 30) + 60; // 60-89 (50%)
    return Math.floor(Math.random() * 11) + 90; // 90-100 (20%)
  }

  private static generateAmount(): number | undefined {
    // 70% chance of having an amount
    if (Math.random() < 0.7) {
      const amounts = [
        10000, 25000, 50000, 75000, 100000, 150000, 200000, 500000,
      ];
      return this.getRandomItem(amounts);
    }
    return undefined;
  }

  private static generateRandomDate(): string {
    const start = new Date('2024-01-01');
    const end = new Date();
    const randomTime =
      start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime).toISOString();
  }

  private static getRandomOpportunityType(): string {
    const types = [
      'Deal',
      'Project',
      'Contract',
      'Partnership',
      'Integration',
      'Consulting',
      'License',
    ];
    return this.getRandomItem(types);
  }
}

// Predefined test scenarios for specific test cases
export const TestScenarios = {
  emptyLeadsList: (): TestLead[] => [],

  singleLead: (): TestLead[] => [testLeads[0]],

  leadsWithAllStatuses: (): TestLead[] => [
    TestDataGenerator.generateLeadWithStatus('new'),
    TestDataGenerator.generateLeadWithStatus('contacted'),
    TestDataGenerator.generateLeadWithStatus('qualified'),
    TestDataGenerator.generateLeadWithStatus('unqualified'),
  ],

  leadsWithVariousScores: (): TestLead[] => [
    TestDataGenerator.generateLeadWithScore(95),
    TestDataGenerator.generateLeadWithScore(75),
    TestDataGenerator.generateLeadWithScore(50),
    TestDataGenerator.generateLeadWithScore(25),
  ],

  leadsForSearchTesting: (): TestLead[] => [
    {
      id: 'search-1',
      name: 'Alice Cooper',
      company: 'Rock Music Corp',
      email: 'alice@rockmusic.com',
      source: 'Website',
      score: 85,
      status: 'new',
    },
    {
      id: 'search-2',
      name: 'Bob Dylan',
      company: 'Folk Songs Inc',
      email: 'bob@folksongs.com',
      source: 'Referral',
      score: 90,
      status: 'contacted',
    },
    {
      id: 'search-3',
      name: 'Charlie Parker',
      company: 'Jazz Innovations',
      email: 'charlie@jazz.com',
      source: 'Cold Call',
      score: 88,
      status: 'qualified',
    },
  ],

  leadsWithInvalidData: (): TestLead[] => [
    TestDataGenerator.generateLeadWithInvalidEmail(),
  ],

  performanceTestData: () => TestDataGenerator.generatePerformanceTestData(),
};

// Legacy function for backward compatibility
export const generateTestLeads = (count: number): TestLead[] => {
  return TestDataGenerator.generateTestLeads(count);
};
