#!/usr/bin/env ts-node
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// Full Korn Ferry 38 competencies (sample titles)
const kf38 = [
  'Action Oriented', 'Approachability', 'Business Acumen', 'Building Relationships', 'Communicating Effectively',
  'Decision Making', 'Developing Others', 'Driving Results', 'Financial Acumen', 'Influencing Others',
  'Innovation', 'Integrity', 'Leading Change', 'Learning Agility', 'Managing Complexity',
  'Negotiation', 'Organizational Savvy', 'Planning and Organizing', 'Problem Solving', 'Project Management',
  'Resilience', 'Risk Management', 'Strategic Agility', 'Talent Management', 'Team Leadership',
  'Technical Expertise', 'Time Management', 'Customer Focus', 'Coaching', 'Collaboration',
  'Creativity', 'Empathy', 'Networking', 'Performance Management', 'Presentation Skills', 'Stakeholder Management'
]

async function main(){
  // Roles (ensure exists)
  const roles = [
    { name: 'Admin', description: { en: 'System administrator', vi: 'Quản trị hệ thống' } },
    { name: 'HRBP', description: { en: 'HR Business Partner', vi: 'Đối tác Nhân sự' } },
    { name: 'LineManager', description: { en: 'Line Manager', vi: 'Trưởng đơn vị' } },
    { name: 'CompetencySpecialist', description: { en: 'Competency Specialist', vi: 'Chuyên viên năng lực' } },
    { name: 'Employee', description: { en: 'Employee', vi: 'Nhân viên' } },
  ]
  for (const r of roles) await prisma.role.upsert({ where: { name: r.name }, update: {}, create: r })

  // Proficiency scale KF_4
  await prisma.proficiencyScale.upsert({
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

  // seed CompetencyCategory and a library for Korn Ferry
  const category = await prisma.competencyCategory.upsert({ where: { code: 'KF-CORE' }, update: {}, create: { code: 'KF-CORE', framework: 'KORN_FERRY', name: { en: 'Korn Ferry Core', vi: 'Korn Ferry Core' } } })
  const library = await prisma.competencyLibrary.upsert({ where: { name: { // Prisma can't upsert on Json - use code via custom unique in production
    en: 'KF Library'
  } as any }, update: {}, create: { name: { en: 'KF Library', vi: 'Thư viện KF' }, orgUnitId: null } }).catch(()=>{
    // fallback simple create
    return prisma.competencyLibrary.findFirst()
  })

  // create 38 competencies
  for (const name of kf38) {
    const code = name.toUpperCase().replace(/[^A-Z0-9]+/g,'_')
    const comp = await prisma.competency.upsert({
      where: { code },
      update: {},
      create: { code, libraryId: library ? library.id : undefined }
    })
    // create initial version
    const v = await prisma.competencyVersion.upsert({
      where: { competencyId_versionNumber: { competencyId: comp.id, versionNumber: 1 } as any },
      update: {},
      create: { competencyId: comp.id, versionNumber: 1, status: 'ACTIVE', title: { en: name, vi: name }, summary: { en: name + ' summary', vi: name + ' tóm tắt' }, effectiveDate: new Date() }
    })
    await prisma.competency.update({ where: { id: comp.id }, data: { currentVersionId: v.id } })
  }

  // admin user
  const adminEmail = 'admin@company.local'
  const adminPassword = 'P@ssw0rd!'
  const hash = await bcrypt.hash(adminPassword, 12)

  const admin = await prisma.user.upsert({ where: { email: adminEmail }, update: {}, create: { email: adminEmail, passwordHash: hash, displayName: { en: 'Administrator', vi: 'Quản trị' } } })
  const adminRole = await prisma.role.findUnique({ where: { name: 'Admin' } })
  if (adminRole) {
    await prisma.userRole.upsert({ where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } as any }, update: {}, create: { userId: admin.id, roleId: adminRole.id } }).catch(()=>{})
  }

  console.log('Full KF38 seed finished')
}

main().catch(e=>{ console.error(e); process.exit(1) }).finally(()=>process.exit())
