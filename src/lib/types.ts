export interface CPPAPIResponse<T> {
  success: boolean;
  status: string;
  message: string;
  path: string;
  timestamp: string;
  data: T;
}
