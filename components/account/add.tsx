'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FC, useCallback, useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { redirect } from 'next/navigation';

import { DATES } from '@/consts/dates';
import { AccountCategory } from '@/entities/account';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Heading } from '@/components/template/heading';
import { Schema, SchemaType } from '@/app/(private)/account/add/shared';
import { post } from '@/services/account';

// add account component
export const Add: FC = () => {
  // form hook
  const form = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      title: '',
      balance: 0,
    },
    mode: 'onChange',
  });

  // loading state for form
  const [loading, setLoading] = useState<boolean>(false);

  // form category value
  const category = form.watch('category');

  // handle form reset
  const onReset = useCallback(() => {
    form.setFocus('title');
    form.reset();
  }, [form]);

  // handle form submit
  const onSubmit = useCallback(
    async (formData: SchemaType) => {
      setLoading(true);
      const { message, status, errors } = await post(formData);
      // setting service errors to form errors
      for (const k in errors) {
        const key = k as keyof SchemaType;
        form.setError(key, { message: errors[key] });
      }
      // showing toast message
      if (message) {
        if (status === 'error') {
          toast.error(message);
        } else if (status === 'success') {
          toast.success(message);
          redirect('/account');
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
    <Form {...form}>
      <form
        className="flex-1 flex flex-col"
        onSubmit={form.handleSubmit(onSubmit, onErrors)}
      >
        <Heading
          title="Add Account"
          description="Add a new account to your list"
          links={[{ title: 'Account', href: '/account' }, { title: 'Add' }]}
        >
          <Button
            variant="ghost"
            type="reset"
            onClick={onReset}
            disabled={loading}
          >
            <RotateCcw />
          </Button>
          <Button type="submit" disabled={loading}>
            <Save />
            Submit
          </Button>
        </Heading>
        <div className="flex-1">
          <div className="grid grid-cols-5">
            <Card className="col-span-3 col-start-2 px-4 py-3 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Account Title"
                          autoFocus
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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
                <FormField
                  control={form.control}
                  name="balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Balance</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Account balance"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
};
