import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const newTodo = await prisma.todo.create({
        data: {
            title: 'Test01',
            description: 'This is test todo'
        }
    });
    const todos = await prisma.todo.findMany();
    console.log(todos);
}
main()
    .catch((e) => {
    throw (e);
})
    .finally(async () => {
    prisma.$disconnect;
});
