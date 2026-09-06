#!/usr/bin/env ts-node
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main(){
  // create some demo report runs for UI
  const existing = await prisma.reportRun.findMany({ take: 1 })
  if (existing.length) { console.log('Reports seed: runs already exist'); return }

  const run1 = await prisma.reportRun.create({ data: { reportType: 'coverage_by_org', params: { days: 30 }, status: 'READY' } })
  await prisma.reportResult.createMany({ data: [
    { runId: run1.id, result: { orgUnitId: 'demo', orgName: { en: 'Demo Org' }, coverage: 75 } },
  ] }).catch(()=>{})

  const run2 = await prisma.reportRun.create({ data: { reportType: 'campaign_summary', params: {}, status: 'READY' } })
  await prisma.reportResult.createMany({ data: [
    { runId: run2.id, result: { campaignId: 'demo-camp', name: 'Demo Campaign', avgScore: 3.2 } }
  ] }).catch(()=>{})

  console.log('Reports seed finished')
}

main().catch(e=>{ console.error(e); process.exit(1) }).finally(()=>process.exit())
