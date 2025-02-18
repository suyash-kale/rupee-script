export * from 'react';

declare module 'react' {
  export function useActionState<State>(
    action: (
      state: Awaited<State>,
      formData: FormData,
    ) => State | Promise<State>,
    initialState: Awaited<State>,
    permalink?: string,
  ): [state: Awaited<State>, dispatch: () => void, isPending: boolean];
}
