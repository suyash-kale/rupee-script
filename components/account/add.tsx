'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FC, useCallback } from 'react';

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
import { RotateCcw } from 'lucide-react';

// form schema definition
const Schema = z
  .object({
    title: z.string().min(2).max(50),
    category: z.nativeEnum(AccountCategory),
    balance: z.string().transform((num) => parseInt(num)),
    bill: z
      .string()
      .min(0)
      .max(31)
      .transform((num) => parseInt(num))
      .optional(),
    due: z
      .string()
      .min(0)
      .max(31)
      .transform((num) => parseInt(num))
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
type SchemaType = z.infer<typeof Schema>;

// add account component
export const Add: FC = () => {
  // form hook
  const form = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      title: '',
      balance: 0,
    },
  });

  // form category value
  const category = form.watch('category');

  // handle form submit
  const onSubmit = useCallback(() => {}, []);

  // handle form error
  const onError = useCallback(
    () => toast.error('Please fill all required fields'),
    [],
  );

  // handle form reset
  const onReset = useCallback(() => {
    form.reset();
  }, [form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex flex-col h-full"
        noValidate
      >
        <Heading
          title="Add Account"
          description="Add a new account to your list"
          links={[{ title: 'Account', href: '/account' }, { title: 'Add' }]}
        >
          <Button variant="ghost" type="reset" onClick={onReset}>
            <RotateCcw />
          </Button>
          <Button type="submit">Submit</Button>
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
