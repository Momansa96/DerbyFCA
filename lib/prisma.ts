import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Vérification de la connexion
prisma.$connect()
  .then(() => {
    console.log('Connexion à la base de données réussie')
  })
  .catch((error) => {
    console.error('Erreur de connexion à la base de données:', error)
  })

export { prisma }