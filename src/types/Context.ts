export interface ContextType<T> {
  data: T | null;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}
