#!/usr/bin/env ts-node
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main(){
  // Roles
  const roles = [
    { name: 'Admin', description: { en: 'System administrator', vi: 'Quản trị hệ thống' } },
    { name: 'HRBP', description: { en: 'HR Business Partner', vi: 'Đối tác Nhân sự' } },
    { name: 'LineManager', description: { en: 'Line Manager', vi: 'Trưởng đơn vị' } },
    { name: 'CompetencySpecialist', description: { en: 'Competency Specialist', vi: 'Chuyên viên năng lực' } },
    { name: 'Employee', description: { en: 'Employee', vi: 'Nhân viên' } },
  ]

  for (const r of roles) {
    await prisma.role.upsert({ where: { name: r.name }, update: {}, create: { name: r.name, description: r.description } })
  }

  // Create admin user
  const adminEmail = 'admin@company.local'
  const adminPassword = 'P@ssw0rd!'
  const hash = await bcrypt.hash(adminPassword, 12)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash: hash, displayName: { en: 'Administrator', vi: 'Quản trị' } }
  })

  // assign Admin role
  const adminRole = await prisma.role.findUnique({ where: { name: 'Admin' } })
  if (adminRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } as any },
      update: {},
      create: { userId: admin.id, roleId: adminRole.id }
    }).catch(()=>{})
  }

  // Proficiency scale seed remains from GĐ0 (kf4) — ensure exists
  console.log('Seed finished')
}

main().catch(e=>{ console.error(e); process.exit(1) }).finally(()=>process.exit())
