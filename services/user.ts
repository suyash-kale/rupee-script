import { UserType } from '@/entities/user';
import connect from '@/mongo/connect';
import User from '@/mongo/entities/user';

type SignInWithGoogleParams = Pick<UserType, 'email' | 'name' | 'picture'>;
export const signInWithGoogle = async (
  data: SignInWithGoogleParams,
): Promise<UserType> => {
  await connect();
  let user = await User.findOne({ email: data.email });
  if (!user) {
    user = await User.create(data);
    user.save();
  }
  return user;
};

export const exist = async (
  email: UserType['email'],
): Promise<undefined | null | UserType> => await User.findOne({ email });
