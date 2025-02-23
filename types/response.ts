// form error type
export type ErrorType = Record<string, undefined | Array<string>>;

// form service response type
export interface StateType<T> {
  status: null | 'success' | 'error';
  message: string;
  errors?: ErrorType;
  data?: T;
}
