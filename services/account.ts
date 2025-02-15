'use server';

import z from 'zod';
import Account from '@/mongo/entities/account';

import {
  Schema,
  SchemaType,
  StateType,
} from '@/app/(private)/account/add/shared';
import { auth } from '@/auth';
import { AccountType } from '@/entities/account';
import connect from '@/mongo/connect';

// post account service
// adding account to database
export const post = async (data: SchemaType): Promise<StateType> => {
  await connect();
  try {
    // validating form data
    await Schema.parseAsync(data);
    // checking if account with same title already exists
    const exists = await Account.findOne({ title: data.title });
    if (exists) {
      return {
        status: 'error',
        message: 'Account with this Title already exists.',
        errors: {
          title: 'Title already exists.',
        },
      };
    }
    // getting current user session
    const session = await auth();
    if (session?.user) {
      // creating account and saving to database
      const account = await Account.create({ ...data, user: session?.user.id });
      account.save();
      return {
        data: account,
        status: 'success',
        message: 'Account added Successfully.',
        errors: {},
      };
    } else {
      throw new Error('Authentication failed.');
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // handling zod validation errors
      return {
        status: 'error',
        message: 'Data validation failed.',
        errors: error.flatten().fieldErrors,
      };
    } else if (error instanceof Error) {
      // handling thrown errors
      return {
        status: 'error',
        message: error.message,
        errors: {},
      };
    }
    // handling unexpected errors
    return {
      status: 'error',
      message: 'Unexpected error occurred.',
      errors: {},
    };
  }
};

export const get = async (): Promise<undefined | Array<AccountType>> => {
  await connect();
  return await Account.find();
};
