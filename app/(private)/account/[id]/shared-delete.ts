import z from 'zod';

// delete form schema definition
export const SchemaDelete = z.object({
  _id: z.string(),
});

// delete form schema type
export type SchemaDeleteType = z.infer<typeof SchemaDelete>;

// delete form service response type
export type StateDeleteType = {
  status: null | 'success' | 'error';
  message: string;
};
