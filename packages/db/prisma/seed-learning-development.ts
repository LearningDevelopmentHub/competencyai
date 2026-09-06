#!/usr/bin/env ts-node
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main(){
  // Seed sample learning resources
  const resources = [
    { title: { en: 'Effective Communication', vi: 'Giao tiếp hiệu quả' }, url: 'https://example.com/course/comm', provider: 'Acme' },
    { title: { en: 'Leadership Essentials', vi: 'Kỹ năng lãnh đạo' }, url: 'https://example.com/course/lead', provider: 'Acme' },
    { title: { en: 'Project Management Basics', vi: 'Quản lý dự án cơ bản' }, url: 'https://example.com/course/pm', provider: 'Coursera' },
  ]
  for (const r of resources){
    await prisma.learningResource.upsert({ where: { url: r.url }, update: {}, create: { title: r.title, url: r.url, provider: r.provider } }).catch(()=>{});
  }

  // create a sample development plan for admin user if exists
  const admin = await prisma.user.findUnique({ where: { email: 'admin@company.local' } });
  if (admin){
    const exists = await prisma.developmentPlan.findFirst({ where: { employeeId: { not: null } } });
    if (!exists){
      const emp = await prisma.employee.findFirst({ where: { userId: admin.id } });
      if (emp){
        await prisma.developmentPlan.create({ data: { employeeId: emp.id, name: { en: 'Sample Plan', vi: 'Kế hoạch mẫu' }, items: { create: [ { title: { en: 'Take Communication course', vi: 'Tham gia khóa giao tiếp' }, targetDate: new Date(Date.now()+1000*60*60*24*30), ownerId: emp.id } ] } } }).catch(()=>{});
      }
    }
  }

  console.log('Learning seed finished')
}

main().catch(e=>{ console.error(e); process.exit(1) }).finally(()=>process.exit())
