import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Création utilisateur de test...')

  // Supprimer l'ancien si existe
  await prisma.user.deleteMany({ where: { email: 'admin@test.fr' } })
  await prisma.organization.deleteMany({ where: { name: 'Organisation Test' } })

  // Créer une organisation
  const org = await prisma.organization.create({
    data: {
      name: 'Organisation Test',
    },
  })

  console.log('✅ Organisation créée:', org.name)

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Créer un utilisateur admin
  const user = await prisma.user.create({
    data: {
      email: 'admin@test.fr',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Test',
      role: 'ADMIN',
      organizationId: org.id,
    },
  })

  console.log('✅ Utilisateur créé:')
  console.log('   📧 Email:', user.email)
  console.log('   🔑 Password: password123')
  console.log('   👤 Nom:', user.firstName, user.lastName)
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
