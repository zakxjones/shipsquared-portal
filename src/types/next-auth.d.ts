import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string;
      role: string;
      firstName?: string;
      lastName?: string;
      storeName?: string;
    } & DefaultSession['user'];
  }

  interface User {
    role: string;
    firstName?: string;
    lastName?: string;
    storeName?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    firstName?: string;
    lastName?: string;
    storeName?: string;
  }
} 