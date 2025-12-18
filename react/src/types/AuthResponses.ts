export interface ErrorResponse {
  status: number;
  error: string;
  message: string;
  path: string;
  details?: Map<string, string>;
  timestamp: string;
}

export interface ValidationErrorResponse {
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors: FieldError[];
  timestamp: string;
}

export interface FieldError {
  field: string;
  message: string;
  rejectedValue: any;
}