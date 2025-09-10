import { toast } from 'sonner';

const TOAST_DURATIONS = {
  SUCCESS: 4000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000,
} as const;

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: TOAST_DURATIONS.SUCCESS,
    });
  },

  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: TOAST_DURATIONS.ERROR,
    });
  },

  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: TOAST_DURATIONS.WARNING,
    });
  },

  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: TOAST_DURATIONS.INFO,
    });
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  },
};

export default showToast;
