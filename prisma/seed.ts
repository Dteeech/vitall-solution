
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const modulesData = [
  // RH
  { name: 'Recrutement', category: 'RH', price: 90.0, description: 'Module de gestion du recrutement' },
  { name: 'Congés', category: 'RH', price: 50.0, description: 'Module de gestion des congés' },
  { name: 'Employés', category: 'RH', price: 25.0, description: 'Module de gestion des employés' },
  { name: 'Entretien', category: 'RH', price: 20.0, description: 'Module de suivi des entretiens' },
  { name: 'Planning', category: 'RH', price: 65.0, description: 'Module de planification des équipes' },
  { name: 'Formation', category: 'RH', price: 40.0, description: 'Module de gestion des formations' },
  { name: 'Paie', category: 'RH', price: 70.0, description: 'Module de gestion de la paie' },
  { name: 'Signature', category: 'RH', price: 50.0, description: 'Module de signature électronique' },

  // Communication
  { name: 'Rendez-vous', category: 'Communication', price: 40.0, description: 'Module de prise de rendez-vous' },
  { name: 'Email marketing', category: 'Communication', price: 15.0, description: 'Module pour campagnes emailing' },
  { name: 'Chat interne', category: 'Communication', price: 15.0, description: 'Module de messagerie instantanée' },

  // Gestion
  { name: 'Flottes', category: 'Gestion', price: 50.0, description: 'Module de gestion de flotte de véhicules' },
  { name: 'Matériel', category: 'Gestion', price: 45.0, description: 'Module de gestion de matériel' },
  { name: 'Compta', category: 'Gestion', price: 60.0, description: 'Module de comptabilité' },
  { name: 'Note de frais', category: 'Gestion', price: 32.90, description: 'Module de gestion des notes de frais' },
];

async function main() {
  console.log(`Start seeding ...`);

  // Seed modules
  for (const moduleData of modulesData) {
    const result = await prisma.module.upsert({
      where: { name: moduleData.name },
      update: moduleData,
      create: moduleData,
    });
    console.log(`Upserted module: ${result.name}`);
  }

  // Créer une organisation de test
  const organizationAdmin = await prisma.organization.upsert({
    where: { id: 'org-admin-id' },
    update: { name: 'Organisation Admin test', address: '4 chemin de la Chatterie, 44100 Saint-Herblain' },
    create: {
      name: 'Organisation Admin test',
      address: '4 chemin de la Chatterie, 44100 Saint-Herblain',
    },
  });
  console.log(`Upserted organization: ${organizationAdmin.name} (id: ${organizationAdmin.id})`);

  const organizationUser = await prisma.organization.upsert({
    where: { id: 'org-user-id' },
    update: { name: 'Organisation de USER test', address: '4 chemin de la Chatterie, 44100 Saint-Herblain' },
    create: {
      name: 'Organisation de USER test',
      address: '4 chemin de la Chatterie, 44100 Saint-Herblain',
    },
  });
  console.log(`Upserted organization: ${organizationUser.name} (id: ${organizationUser.id})`);
  
  // Hash des mots de passe depuis les variables d'environnement
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMeInProduction!';
  const userPassword = process.env.SEED_USER_PASSWORD || 'ChangeMeInProduction!';
  
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
  const hashedUserPassword = await bcrypt.hash(userPassword, 10);

  // Création Admin — update inclut organizationId pour rattraper les users existants
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.fr' },
    update: {
      organizationId: organizationAdmin.id,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'Vitall',
    },
    create: {
      email: 'admin@test.fr',
      password: hashedAdminPassword,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'Vitall',
      organizationId: organizationAdmin.id,
    },
  });
  console.log(`Upserted admin user: ${admin.email} (orgId: ${admin.organizationId})`);

  // Création User Standard
  const user = await prisma.user.upsert({
    where: { email: 'user@test.fr' },
    update: {
      organizationId: organizationUser.id,
      role: 'USER',
      firstName: 'User',
      lastName: 'Vitall',
    },
    create: {
      email: 'user@test.fr',
      password: hashedUserPassword,
      role: 'USER',
      firstName: 'User',
      lastName: 'Vitall',
      organizationId: organizationUser.id,
    },
  });
  console.log(`Upserted standard user: ${user.email} (orgId: ${user.organizationId})`);

  // Créer la subscription pour l'organisation Admin
  const subscription = await prisma.subscription.upsert({
    where: { organizationId: organizationAdmin.id },
    update: { status: 'ACTIVE' },
    create: {
      organizationId: organizationAdmin.id,
      status: 'ACTIVE',
      startDate: new Date(),
      monthlyPrice: 270.0,
    },
  });
  console.log(`Upserted subscription: ${subscription.id} (org: ${organizationAdmin.name})`);

  // Activer le module Planning par défaut pour l'admin
  const planningModule = await prisma.module.findUnique({ where: { name: 'Planning' } });
  const recrutementModule = await prisma.module.findUnique({ where: { name: 'Recrutement' } });

  if (planningModule) {
    await prisma.subscriptionModule.upsert({
      where: {
        subscriptionId_moduleId: {
          subscriptionId: subscription.id,
          moduleId: planningModule.id,
        },
      },
      update: {},
      create: {
        subscriptionId: subscription.id,
        moduleId: planningModule.id,
      },
    });
    console.log(`Activated module: Planning`);
  }

  if (recrutementModule) {
    await prisma.subscriptionModule.upsert({
      where: {
        subscriptionId_moduleId: {
          subscriptionId: subscription.id,
          moduleId: recrutementModule.id,
        },
      },
      update: {},
      create: {
        subscriptionId: subscription.id,
        moduleId: recrutementModule.id,
      },
    });
    console.log(`Activated module: Recrutement`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
