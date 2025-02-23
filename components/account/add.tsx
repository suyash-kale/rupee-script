'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

import { AccountCategory, AccountType } from '@/entities/account';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { POST, PUT } from '@/services/account';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DATES } from '@/consts/dates';
import { Busy } from '@/components/atom/busy';
import { Optional, Require } from '@/types/util';

// form schema definition
export const Schema = z
  .object({
    _id: z.string().optional(),
    title: z.string().min(2).max(50),
    category: z.nativeEnum(AccountCategory),
    balance: z.string().regex(/^\d+$/).transform(Number).or(z.number()),
    bill: z
      .string()
      .min(0)
      .max(31)
      .regex(/^\d+$/)
      .transform(Number)
      .or(z.number())
      .optional(),
    due: z
      .string()
      .min(0)
      .max(31)
      .regex(/^\d+$/)
      .transform(Number)
      .or(z.number())
      .optional(),
  })
  .refine(
    (data) => {
      // making sure bill in required for credit category
      if (data.category === AccountCategory.Credit && !data.bill) {
        return false;
      }
      return true;
    },
    {
      path: ['bill'],
      message: 'Required',
    },
  )
  .refine(
    (data) => {
      // making sure due in required for credit category
      if (data.category === AccountCategory.Credit && !data.due) {
        return false;
      }
      return true;
    },
    {
      path: ['due'],
      message: 'Required',
    },
  );

// form schema type
export type SchemaType = z.infer<typeof Schema>;

interface AddProps {
  readonly account?: Optional<AccountType, '_id'>;
}

// update account component
export const Add: FC<AddProps> = ({ account }) => {
  // form hook
  const form = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: { title: '', balance: 0, ...account },
    mode: 'onChange',
  });

  const { control, reset, setValue, setError, handleSubmit } = form;

  // loading state for form
  const [loading, setLoading] = useState<boolean>(false);

  // dialog open state
  const [open, setOpen] = useState(false);

  // form category value
  const category = form.watch('category');

  const isEdit: boolean = !!account?._id;

  // handle form submit
  const onSubmit = useCallback(
    async (formData: SchemaType) => {
      setLoading(true);

      const { message, status, errors } = await (formData._id
        ? PUT(formData as Require<AccountType, '_id'>)
        : POST(formData));

      // setting service errors to form errors
      for (const k in errors) {
        const key = k as keyof SchemaType;
        const message = errors[key];
        if (message) {
          setError(key, { message: message[0] });
        }
      }

      // showing toast message
      if (message) {
        if (status === 'error') {
          toast.error(message);
        } else if (status === 'success') {
          toast.success(message);
          setOpen(false);
        }
      }

      setLoading(false);
    },
    [setError],
  );

  // handle form errors
  const onErrors = useCallback(
    () => toast.error('Please fill all required fields'),
    [],
  );

  // reset form on dialog close
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  // set form values on dialog open in edit mode
  useEffect(() => {
    if (open && account) {
      setValue('title', account.title);
      setValue('category', account.category);
      setValue('balance', account.balance ?? 0);
      setValue('bill', account.bill);
      setValue('due', account.due);
    }
  }, [open, account, setValue]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isEdit ? 'secondary' : 'default'}
          size={isEdit ? 'icon' : 'default'}
        >
          {isEdit ? (
            <Pencil />
          ) : (
            <>
              <Plus /> Add
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            className="flex-1 flex flex-col"
            onSubmit={handleSubmit(onSubmit, onErrors)}
          >
            <DialogHeader>
              <DialogTitle>{isEdit ? 'Edit' : 'Add'} Account</DialogTitle>
              <DialogDescription>
                {isEdit
                  ? 'Make changes to your Account here.'
                  : 'Add a new account to your list.'}
              </DialogDescription>
            </DialogHeader>
            <Busy className="grid grid-cols-2 gap-4 py-4" loading={loading}>
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem className={isEdit ? 'col-span-2' : ''}>
                    <FormLabel required>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Account Title"
                        autoFocus
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isEdit && (
                <FormField
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Account Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(AccountCategory).map(
                            ([title, value]) => (
                              <SelectItem key={value} value={value}>
                                {title}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {category === AccountCategory.Credit && (
                <FormField
                  control={control}
                  name="bill"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Bill date</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Account Bill date" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DATES.map((date) => (
                            <SelectItem key={date} value={date.toString()}>
                              {date}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {category === AccountCategory.Credit && (
                <FormField
                  control={control}
                  name="due"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Due date</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Account Due date" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DATES.map((date) => (
                            <SelectItem key={date} value={date.toString()}>
                              {date}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!isEdit && (
                <FormField
                  control={control}
                  name="balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Balance</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Account balance"
                          type="number"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </Busy>
            <DialogFooter>
              <Button
                type="button"
                loading={loading}
                onClick={() => setOpen(false)}
                variant="secondary"
              >
                <X />
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                <Save />
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
