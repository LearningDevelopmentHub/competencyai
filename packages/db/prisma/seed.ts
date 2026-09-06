#!/usr/bin/env ts-node
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main(){
  // Upsert roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: { en: 'System administrator', vi: 'Quản trị hệ thống' } },
  })

  const hrRole = await prisma.role.upsert({
    where: { name: 'HRBP' },
    update: {},
    create: { name: 'HRBP', description: { en: 'HR Business Partner', vi: 'Đối tác Nhân sự' } },
  })

  // Proficiency scale KF_4
  const kf4 = await prisma.proficiencyScale.upsert({
    where: { id: 'kf4-scale-00000000-0000-0000-0000-000000000000' },
    update: {},
    create: {
      id: 'kf4-scale-00000000-0000-0000-0000-000000000000',
      name: { en: 'Korn Ferry 4-level', vi: 'Korn Ferry 4 mức' },
      framework: 'KF_4',
      levels: {
        create: [
          { ordinal: 1, label: { en: 'Basic', vi: 'Cơ bản' } },
          { ordinal: 2, label: { en: 'Intermediate', vi: 'Trung cấp' } },
          { ordinal: 3, label: { en: 'Advanced', vi: 'Nâng cao' } },
          { ordinal: 4, label: { en: 'Expert', vi: 'Chuyên gia' } },
        ]
      }
    }
  })

  // sample org units
  const root = await prisma.orgUnit.upsert({
    where: { code: 'COMPANY' },
    update: {},
    create: { code: 'COMPANY', name: { en: 'Example Company', vi: 'Công ty Ví dụ' }, tier: 1, unitType: 'COMPANY' }
  })

  const dept = await prisma.orgUnit.upsert({
    where: { code: 'DEPT-HR' },
    update: {},
    create: { code: 'DEPT-HR', name: { en: 'Human Resources', vi: 'Nhân sự' }, tier: 2, unitType: 'DEPARTMENT', parentId: root.id }
  })

  console.log('Seed finished')
}

main().catch(e=>{console.error(e); process.exit(1)}).finally(()=>process.exit())
