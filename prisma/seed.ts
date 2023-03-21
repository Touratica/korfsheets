import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const teams: Prisma.TeamCreateInput[] = [
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "CCCD",
          name: "Clube de Carnaxide Cultura e Desporto",
        },
        where: {
          initials: "CCCD",
        },
      },
    },
    designation: "A",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "CCCD",
          name: "Clube de Carnaxide Cultura e Desporto",
        },
        where: {
          initials: "CCCD",
        },
      },
    },
    designation: "B",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "CCCD",
          name: "Clube de Carnaxide Cultura e Desporto",
        },
        where: {
          initials: "CCCD",
        },
      },
    },
    designation: "C",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "CCCD",
          name: "Clube de Carnaxide Cultura e Desporto",
        },
        where: {
          initials: "CCCD",
        },
      },
    },
    designation: "D",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "CCO",
          name: "Clube de Corfebol de Oeiras",
        },
        where: {
          initials: "CCO",
        },
      },
    },
    designation: "A",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "CCO",
          name: "Clube de Corfebol de Oeiras",
        },
        where: {
          initials: "CCO",
        },
      },
    },
    designation: "B",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "CCO",
          name: "Clube de Corfebol de Oeiras",
        },
        where: {
          initials: "CCO",
        },
      },
    },
    designation: "C",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "CCRAM",
          name: "Centro Cultural e Recreativo do Alto do Moinho",
        },
        where: {
          initials: "CCRAM",
        },
      },
    },
    designation: "A",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "CCRAM",
          name: "Centro Cultural e Recreativo do Alto do Moinho",
        },
        where: {
          initials: "CCRAM",
        },
      },
    },
    designation: "B",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "CRCQL",
          name: "Centro Recreativo e Cultural Quinta dos Lombos",
        },
        where: {
          initials: "CRCQL",
        },
      },
    },
    designation: "A",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "CRCQL",
          name: "Centro Recreativo e Cultural Quinta dos Lombos",
        },
        where: {
          initials: "CRCQL",
        },
      },
    },
    designation: "B",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "CRCQL",
          name: "Centro Recreativo e Cultural Quinta dos Lombos",
        },
        where: {
          initials: "CRCQL",
        },
      },
    },
    designation: "C",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "GDBD",
          name: "Grupo Desportivo dos Bons Dias",
        },
        where: {
          initials: "GDBD",
        },
      },
    },
    designation: "A",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "GDBD",
          name: "Grupo Desportivo dos Bons Dias",
        },
        where: {
          initials: "GDBD",
        },
      },
    },
    designation: "B",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "GDBD",
          name: "Grupo Desportivo dos Bons Dias",
        },
        where: {
          initials: "GDBD",
        },
      },
    },
    designation: "C",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "KLX",
          name: "Clube Korfball de Lisboa - KLX",
        },
        where: {
          initials: "KLX",
        },
      },
    },
    designation: "A",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "KLX",
          name: "Clube Korfball de Lisboa - KLX",
        },
        where: {
          initials: "KLX",
        },
      },
    },
    designation: "B",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "KLX",
          name: "Clube Korfball de Lisboa - KLX",
        },
        where: {
          initials: "KLX",
        },
      },
    },
    designation: "C",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "NCB",
          name: "Núcleo de Corfebol de Benfica",
        },
        where: {
          initials: "NCB",
        },
      },
    },
    designation: "A",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "NCB",
          name: "Núcleo de Corfebol de Benfica",
        },
        where: {
          initials: "NCB",
        },
      },
    },
    designation: "B",
  },
  {
    Club: {
      connectOrCreate: {
        create: {
          initials: "NCB",
          name: "Núcleo de Corfebol de Benfica",
        },
        where: {
          initials: "NCB",
        },
      },
    },
    designation: "C",
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const t of teams) {
    const team = await prisma.team.create({
      data: t,
    });
    console.log(`Created team: ${team.clubInitials} ${team.designation}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
