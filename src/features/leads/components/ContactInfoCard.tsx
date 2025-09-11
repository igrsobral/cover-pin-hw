import type { Lead } from '@shared/types';

interface ContactInfoCardProps {
  lead: Lead;
}

export const ContactInfoCard = ({ lead }: ContactInfoCardProps) => {
  return (
    <div className="bg-slate-50 shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Contact Information
      </h3>
      <div className="space-y-3">
        <div>
          <dt className="text-sm font-medium text-gray-500">Name</dt>
          <dd className="mt-1 text-sm text-gray-900">{lead.name}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Company</dt>
          <dd className="mt-1 text-sm text-gray-900">{lead.company}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Email</dt>
          <dd className="mt-1 text-sm text-gray-900">
            <a
              href={`mailto:${lead.email}`}
              className="text-blue-600 hover:text-blue-500"
            >
              {lead.email}
            </a>
          </dd>
        </div>
      </div>
    </div>
  );
};
