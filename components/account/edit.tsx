'use client';

import { FC, useCallback, useState } from 'react';
import { Pencil, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import {
  SchemaPut,
  SchemaPutType,
} from '@/app/(private)/account/[id]/shared-put';
import { PUT } from '@/services/account';
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

interface EditProps {
  readonly account?: AccountType;
}

// update account component
export const Edit: FC<EditProps> = ({ account }) => {
  // form hook
  const form = useForm<SchemaPutType>({
    resolver: zodResolver(SchemaPut),
    defaultValues: account,
    mode: 'onChange',
  });

  // loading state for form
  const [loading, setLoading] = useState<boolean>(false);

  // dialog open state
  const [open, setOpen] = useState(false);

  // form category value
  const category = form.watch('category');

  // handle form submit
  const onSubmit = useCallback(
    async (formData: SchemaPutType) => {
      setLoading(true);
      const { message, status, errors } = await PUT(formData);
      // setting service errors to form errors
      for (const k in errors) {
        const key = k as keyof SchemaPutType;
        form.setError(key, { message: errors[key] });
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
    [form],
  );

  // handle form errors
  const onErrors = useCallback(
    () => toast.error('Please fill all required fields'),
    [],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            className="flex-1 flex flex-col"
            onSubmit={form.handleSubmit(onSubmit, onErrors)}
          >
            <DialogHeader>
              <DialogTitle>Edit Account</DialogTitle>
              <DialogDescription>
                Make changes to your Account here.
              </DialogDescription>
            </DialogHeader>
            <Busy className="grid grid-cols-2 gap-4 py-4" loading={loading}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-2">
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
              {category === AccountCategory.Credit && (
                <FormField
                  control={form.control}
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
                  control={form.control}
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
            </Busy>
            <DialogFooter>
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
