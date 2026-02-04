export interface FieldError {
  field: string;
  message: string;
}

export interface SuccessResponse<T> {
  title: string;
  message: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  title: string;
  message: string;
  errors?: FieldError[];
}