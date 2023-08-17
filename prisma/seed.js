const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')

async function main() {
  // Category
  const categorySerum = await prisma.category.create({
    data: {
      name: 'Serum',
      template: 'TEMPLATE_ONE'
    },
  })

  const categoryDerma = await prisma.category.create({
    data: {
      name: 'Derma',
      template: 'TEMPLATE_TWO'
    },
  })

  console.log({
    categorySerum,
    categoryDerma,
  })

  // User
  const dataUserAdmin = {
    name: 'Admin',
    lastname: 'Admin',
    email: 'admin@vita.com',
    type: 'ADMIN',
    password: 'A123456789m'
  }

  dataUserAdmin.password = await bcrypt.hash(dataUserAdmin.password, 10)

  const userAdmin = await prisma.user.create({
    data: dataUserAdmin,
  })

  console.log({
    userAdmin,
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })