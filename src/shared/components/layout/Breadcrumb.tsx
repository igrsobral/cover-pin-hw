import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <div className="flex items-center">
                <Home className="w-4 h-4 text-gray-400" />
                <span className="sr-only">Home</span>
              </div>
            </li>
            {items.map((item, index) => (
              <li key={index}>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                  {item.href && !item.current ? (
                    <a
                      href={item.href}
                      className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span
                      className={`${
                        item.current
                          ? 'text-gray-900 font-medium'
                          : 'text-gray-500'
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumb;
