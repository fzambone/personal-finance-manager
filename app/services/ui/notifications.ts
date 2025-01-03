import { toast, ToastOptions, Toaster } from "react-hot-toast";

export type NotificationVariant = "success" | "error" | "loading" | "info";

interface NotificationOptions extends Omit<ToastOptions, "id"> {
  message: string;
  variant?: NotificationVariant;
}

const DEFAULT_OPTIONS: Partial<ToastOptions> = {
  duration: 4000,
  position: "top-right",
};

class NotificationService {
  private static instance: NotificationService;

  private constructor() {
    // Initialize toast configuration
    toast.custom = toast.custom.bind(toast);
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  show({ message, variant = "info", ...options }: NotificationOptions): string {
    const toastOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    switch (variant) {
      case "success":
        return toast.success(message, toastOptions);
      case "error":
        return toast.error(message, toastOptions);
      case "loading":
        return toast.loading(message, toastOptions);
      default:
        return toast(message, toastOptions);
    }
  }

  dismiss(toastId: string) {
    toast.dismiss(toastId);
  }

  // Helper methods for common use cases
  success(
    message: string,
    options?: Omit<NotificationOptions, "message" | "variant">
  ) {
    return this.show({ message, variant: "success", ...options });
  }

  error(
    message: string,
    options?: Omit<NotificationOptions, "message" | "variant">
  ) {
    return this.show({ message, variant: "error", ...options });
  }

  loading(
    message: string,
    options?: Omit<NotificationOptions, "message" | "variant">
  ) {
    return this.show({ message, variant: "loading", ...options });
  }

  info(
    message: string,
    options?: Omit<NotificationOptions, "message" | "variant">
  ) {
    return this.show({ message, variant: "info", ...options });
  }
}

export const notificationService = NotificationService.getInstance();
