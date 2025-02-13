import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

import { exist, signInWithGoogle } from '@/services/user';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      if (user.name && user.email) {
        signInWithGoogle({
          email: user.email,
          name: user.name,
          picture: user.image,
        });
      }
      return true;
    },
    async jwt({ token, profile }) {
      if (profile?.email) {
        const user = await exist(profile.email);
        if (user) {
          token.id = user._id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});
