import NextAuth from "next-auth"
import EmailProvider from 'next-auth/providers/email'
import FirebaseAdapter from 'next-auth/adapters/'
export const authOptions = {

  // Configure one or more authentication providers
  providers: [EmailProvider({

  })]
}

export default NextAuth(authOptions)