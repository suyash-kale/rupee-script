import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

import { exist, signInWithGoogle } from '@/services/user';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user: { name, email, image } }) {
      if (name && email) {
        // signing up the user if not exists
        await signInWithGoogle({
          name,
          email,
          image,
        });
      }
      return true;
    },
    async jwt({ token, profile }) {
      if (profile?.email) {
        // getting the user from the database
        const user = await exist(profile.email);
        if (user) {
          // updating the token with the database user
          token.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        }
      }
      return token;
    },
    async session({ session, token }) {
      // updating the session with the updated token
      Object.assign(session, { user: token.user });
      return session;
    },
  },
});
