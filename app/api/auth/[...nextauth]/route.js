import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "@/lib/dbConnect"
import bcrypt from 'bcryptjs'
import User from "@/model/User"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        userId: { label: "Health ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { userId, password } = credentials

        try {
          await dbConnect()

          // Find user by unique userId (PAT_xxx, DOC_xxx, ANM_xxx)
          const user = await User.findOne({ userId: userId.toUpperCase() })

          if (!user) {
            throw new Error('No user found with this Health ID')
          }

          // Check if user is active
          if (!user.isActive) {
            throw new Error('Account is deactivated')
          }

          // Verify password
          const passwordMatch = await bcrypt.compare(password, user.password)

          if (!passwordMatch) {
            throw new Error('Invalid password')
          }

          // Return user object without password
          return {
            id: user._id.toString(),
            userId: user.userId,
            email: user.email,
            name: user.name,
            userType: user.userType,
            role: user.userType
          }

        } catch (error) {
          console.log('Auth error:', error)
          throw new Error(error.message || 'Authentication failed')
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.userId = user.userId
        token.userType = user.userType
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id
        session.user.userId = token.userId
        session.user.userType = token.userType
        session.user.role = token.role
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }