#!/usr/bin/env ts-node
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main(){
  // Seed JobFamilies
  const families = [
    { code: 'ENG', name: { en: 'Engineering', vi: 'Kỹ thuật' } },
    { code: 'SALES', name: { en: 'Sales', vi: 'Kinh doanh' } },
    { code: 'HR', name: { en: 'Human Resources', vi: 'Nhân sự' } },
    { code: 'FIN', name: { en: 'Finance', vi: 'Tài chính' } },
  ];
  for (const f of families){
    await prisma.jobFamily.upsert({ where: { code: f.code }, update: {}, create: { code: f.code, name: f.name } }).catch(()=>{});
  }

  // Seed JobLevels canonical
  const levels = [
    { levelCode: 'ELIC', name: { en: 'Entry-Level Individual Contributor', vi: 'IC cấp đầu vào' }, rank: 10 },
    { levelCode: 'MID', name: { en: 'Mid-Level', vi: 'Trung cấp' }, rank: 20 },
    { levelCode: 'SR_IC', name: { en: 'Senior IC', vi: 'Cao cấp IC' }, rank: 30 },
    { levelCode: 'FLL', name: { en: 'First Line Leader', vi: 'Quản lý trực tiếp' }, rank: 40 },
    { levelCode: 'MLL', name: { en: 'Mid Level Leader', vi: 'Quản lý trung gian' }, rank: 50 },
    { levelCode: 'BUL', name: { en: 'Business Unit Lead', vi: 'Trưởng bộ phận' }, rank: 60 },
    { levelCode: 'SE', name: { en: 'Senior Executive', vi: 'Cấp điều hành' }, rank: 70 },
  ];

  const familiesDb = await prisma.jobFamily.findMany();
  for (const fam of familiesDb){
    for (const l of levels){
      const exists = await prisma.jobLevel.findFirst({ where: { jobFamilyId: fam.id, levelCode: l.levelCode } });
      if (!exists){
        await prisma.jobLevel.create({ data: { jobFamilyId: fam.id, levelCode: l.levelCode, name: l.name, stageOfContribution: 1, isManagerial: ['MLL','BUL','SE'].includes(l.levelCode), rank: l.rank } });
      }
    }
  }

  console.log('Job families and levels seeded')
}

main().catch(e=>{ console.error(e); process.exit(1) }).finally(()=>process.exit())
