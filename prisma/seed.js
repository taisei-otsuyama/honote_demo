const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const userId = 'cm7aoca200000qtqcpfefyxwu';
  
  const blogs = Array.from({ length: 100 }, (_, i) => ({
    title: `ブログ記事 ${i + 1}`,
    content: `これはブログ記事${i + 1}の内容です。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
    userId: userId,
  }));

  for (const blog of blogs) {
    await prisma.blog.create({
      data: blog,
    });
  }

  console.log('100件のブログを作成しました。');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
