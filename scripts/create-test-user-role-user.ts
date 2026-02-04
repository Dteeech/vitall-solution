import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Création utilisateur USER de test...')

  // Récupérer une organisation existante
  const org = await prisma.organization.findFirst()

  if (!org) {
    console.error('❌ Aucune organisation trouvée. Créez d\'abord un utilisateur admin.')
    return
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash('user123', 10)

  // Supprimer l'ancien user s'il existe
  await prisma.user.deleteMany({ where: { email: 'user@test.fr' } })

  // Créer un utilisateur avec le rôle USER
  const user = await prisma.user.create({
    data: {
      email: 'user@test.fr',
      password: hashedPassword,
      firstName: 'User',
      lastName: 'Test',
      role: 'USER',
      organizationId: org.id,
    },
  })

  console.log('✅ Utilisateur USER créé:')
  console.log('   📧 Email:', user.email)
  console.log('   🔑 Password: user123')
  console.log('   👤 Nom:', user.firstName, user.lastName)
  console.log('   🔒 Rôle:', user.role)
  console.log('')
  console.log('⚠️  Cet utilisateur ne pourra PAS accéder à /admin')
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
