'use client';

import { FC, useActionState, useCallback, useEffect, useState } from 'react';
import { Trash } from 'lucide-react';
import z from 'zod';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { SchemaDelete, SchemaDeleteType } from '@/services/account/shared';
import { DELETE } from '@/services/account';
import { AccountType } from '@/entities/account';
import { StateType } from '@/types/response';

type StateDeleteType = StateType<AccountType>;

interface DeleteProps {
  readonly account?: AccountType;
}

export const Delete: FC<DeleteProps> = ({ account }) => {
  // confirmation modal state
  const [open, setOpen] = useState(false);

  // close confirmation modal
  const close = useCallback(() => setOpen(false), []);

  // handle delete form submission
  const onSubmit = useCallback(
    async (
      _: StateDeleteType,
      formData: FormData,
    ): Promise<StateDeleteType> => {
      const data = Object.fromEntries(formData.entries()) as SchemaDeleteType;
      try {
        // validate form data
        await SchemaDelete.parseAsync(data);
        return await DELETE(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            status: 'error',
            message: 'Validation error',
          };
        }
      }
      return {
        status: 'error',
        message: 'An unexpected error occurred',
      };
    },
    [],
  );

  const [{ status, message }, action, pending] =
    useActionState<StateDeleteType>(onSubmit, {
      status: null,
      message: '',
    });

  // handling form submission
  useEffect(() => {
    if (message) {
      if (status === 'success') {
        toast.success(message);
        close();
        redirect('/account');
      } else if (status === 'error') {
        toast.error(message);
      }
    }
  }, [status, message, close]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-red-800"
        >
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={close} disabled={pending}>
            Cancel
          </Button>
          <form action={action} className="flex gap-4">
            <input type="hidden" name="_id" value={account?._id} />
            <Button variant="destructive" type="submit" loading={pending}>
              Continue
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
