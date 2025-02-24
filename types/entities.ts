import { Types } from 'mongoose';

export type EntityType<T> = T & { _id: Types.ObjectId };
