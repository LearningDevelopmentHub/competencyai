#!/usr/bin/env ts-node
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main(){
  // Create sample campaign
  const camp = await prisma.assessmentCampaign.upsert({ where: { name: 'Sample Campaign' }, update: {}, create: { name: 'Sample Campaign', description: { en: 'Sample campaign for testing', vi: 'Chiến dịch mẫu' }, startAt: new Date(), endAt: new Date(Date.now()+1000*60*60*24*7) } }).catch(()=>prisma.assessmentCampaign.findFirst());

  // ensure some employees exist
  const employees = await prisma.employee.findMany({ take: 10 });
  if (!employees.length){
    // create sample employees
    for (let i=1;i<=10;i++){
      const u = await prisma.user.create({ data: { email: `user${i}@example.local`, passwordHash: await bcrypt.hash('P@ssw0rd!',12), displayName: { en: `User ${i}` } } });
      await prisma.employee.create({ data: { employeeCode: `EMP${i}`, userId: u.id, fullName: { en: `User ${i}` } } });
    }
  }

  console.log('Assessment seed finished')
}

main().catch(e=>{ console.error(e); process.exit(1) }).finally(()=>process.exit())
