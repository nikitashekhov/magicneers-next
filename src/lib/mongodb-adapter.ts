import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

interface VerificationTokenData {
  identifier: string
  token: string
  expires: Date
}

export function MongoDBAdapter(prisma: PrismaClient) {
  const baseAdapter = PrismaAdapter(prisma)
  
  return {
    ...baseAdapter,
    async createVerificationToken(data: VerificationTokenData) {
      return await prisma.verificationToken.create({
        data: {
          identifier: data.identifier,
          token: data.token,
          expires: data.expires,
        },
      })
    },
    async useVerificationToken(data: VerificationTokenData) {
      const verificationToken = await prisma.verificationToken.findFirst({
        where: {
          identifier: data.identifier,
          token: data.token,
          expires: {
            gt: new Date(),
          },
        },
      })

      if (verificationToken) {
        await prisma.verificationToken.delete({
          where: {
            id: verificationToken.id,
          },
        })
        return verificationToken
      }

      return null
    },
  }
}
