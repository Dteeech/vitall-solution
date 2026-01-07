
import { PrismaClient } from '@prisma/client'

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
  for (const moduleData of modulesData) {
    const result = await prisma.module.upsert({
      where: { name: moduleData.name },
      update: moduleData,
      create: moduleData,
    });
    console.log(`Upserted module: ${result.name}`);
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
