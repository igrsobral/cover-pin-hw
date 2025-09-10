import { type ReactNode, useCallback, useEffect, useState } from 'react';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const SlideOver = ({ isOpen, onClose, title, children }: SlideOverProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      document.body.style.overflow = '';
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', handleEscape);
      };
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleClose]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 overflow-hidden z-200">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-0 bg-gray-500 transition-opacity duration-300 ease-out ${
            isAnimating ? 'bg-opacity-75' : 'bg-opacity-0'
          }`}
          onClick={handleClose}
        />
        <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="relative w-screen max-w-md">
            <div
              className={`h-full flex flex-col py-6 bg-white overflow-y-scroll transform transition-transform duration-300 ease-out ${
                isAnimating ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <div className="px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2
                    className={`text-lg font-medium text-gray-900 transition-opacity duration-300 delay-150 ${
                      isAnimating ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {title}
                  </h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button
                      className={`bg-white rounded-md text-gray-600 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:scale-110 ${
                        isAnimating
                          ? 'opacity-100 rotate-0'
                          : 'opacity-0 rotate-90'
                      }`}
                      onClick={handleClose}
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
              <div
                className={`mt-6 relative flex-1 px-4 sm:px-6 transition-all duration-300 delay-100 ${
                  isAnimating
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
              >
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
