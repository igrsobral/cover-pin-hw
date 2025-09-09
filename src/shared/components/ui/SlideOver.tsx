import { type ReactNode, useEffect } from 'react';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const SlideOver = ({ isOpen, onClose, title, children }: SlideOverProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-hidden z-200">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
              <div className="px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close panel</span>
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 relative flex-1 px-4 sm:px-6">
                {children}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SlideOver;
