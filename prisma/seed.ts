
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { addDays, startOfWeek, addHours, format } from 'date-fns'

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
    where: { id: 'org-admin-id' }, // Utiliser un ID fixe pour pouvoir rafraichir le seed sans erreur
    update: {
        name: 'Organisation Admin test',
        address: '4 chemin de la Chatterie, 44100 Saint-Herblain',
    },
    create: {
      id: 'org-admin-id',
      name: 'Organisation Admin test',
      address: '4 chemin de la Chatterie, 44100 Saint-Herblain',
    },
  });
  console.log(`Upserted organization: ${organizationAdmin.name}`);

  // Hash des mots de passe (hashSync pour compatibilité container)
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin1234!';
  const hashedAdminPassword = bcrypt.hashSync(adminPassword, 10);

  const userPassword = process.env.SEED_USER_PASSWORD || 'User1234!';
  const hashedUserPassword = bcrypt.hashSync(userPassword, 10);

  // Création Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.fr' },
    update: {
        password: hashedAdminPassword,
        role: 'ADMIN',
        firstName: 'Admin',
        lastName: 'Vitall',
        organizationId: organizationAdmin.id,
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
  console.log(`Upserted admin user: ${admin.email}`);

  // Création User
  const user = await prisma.user.upsert({
    where: { email: 'user@test.fr' },
    update: {
        password: hashedUserPassword,
        role: 'USER',
        firstName: 'Jean',
        lastName: 'Dupont',
        organizationId: organizationAdmin.id,
    },
    create: {
      email: 'user@test.fr',
      password: hashedUserPassword,
      role: 'USER',
      firstName: 'Jean',
      lastName: 'Dupont',
      organizationId: organizationAdmin.id,
    },
  });
  console.log(`Upserted user: ${user.email}`);

  // --- SEED CANDIDATURES ---
  // La candidature de l'user test est identifiée par son email
  const candidaturesData = [
    { firstName: 'Jean', lastName: 'Dupont', email: 'user@test.fr', status: 'INTERVIEW' },
    { firstName: 'Sophie', lastName: 'Martin', email: 'sophie.martin@example.com', status: 'INTERVIEW' },
    { firstName: 'Lucas', lastName: 'Bernard', email: 'lucas.bernard@example.com', status: 'REJECTED' },
    { firstName: 'Emma', lastName: 'Petit', email: 'emma.petit@example.com', status: 'ACCEPTED' },
  ];

  for (const cand of candidaturesData) {
      await prisma.candidature.upsert({
          where: { email: cand.email },
          update: { status: cand.status as any },
          create: {
              firstName: cand.firstName,
              lastName: cand.lastName,
              email: cand.email,
              status: cand.status as any,
              organizationId: organizationAdmin.id
          }
      });
  }
  console.log(`Seeded ${candidaturesData.length} candidatures`);

  // --- SEED PLANNING & SHIFTS ---
  const planning = await prisma.planning.create({
      data: {
          name: "Planning Principal",
          organizationId: organizationAdmin.id
      }
  });
  console.log(`Created Planning: ${planning.name}`);

  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Start Monday

  const shiftsData = [
      { dayOffset: 0, startHour: 8, endHour: 16, type: 'GARDE' }, // Lundi
      { dayOffset: 1, startHour: 9, endHour: 17, type: 'FORMATION' }, // Mardi
      { dayOffset: 2, startHour: 14, endHour: 22, type: 'GARDE' }, // Mercredi
      { dayOffset: 3, startHour: 8, endHour: 12, type: 'REUNION' }, // Jeudi matin
      { dayOffset: 4, startHour: 18, endHour: 23, type: 'ASTREINTE' }, // Vendredi soir
  ];

  for (const shift of shiftsData) {
      const shiftDate = addDays(startOfCurrentWeek, shift.dayOffset);
      
      const startTime = new Date(shiftDate);
      startTime.setHours(shift.startHour, 0, 0, 0);
      
      const endTime = new Date(shiftDate);
      endTime.setHours(shift.endHour, 0, 0, 0);

      await prisma.shift.create({
          data: {
              planningId: planning.id,
              userId: admin.id, // Assigné à l'admin pour le test
              startTime: startTime,
              endTime: endTime,
              type: shift.type as any,
              isAvailable: false
          }
      });
  }
  console.log(`Seeded ${shiftsData.length} shifts for this week`);


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
