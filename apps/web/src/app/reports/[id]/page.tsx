import React from 'react'
import useSWR from 'swr'
import Link from 'next/link'

const fetcher = (u:string)=>fetch(u).then(r=>r.json())

export default function ReportRunPage({ params }:{ params:any }){
  const runId = params.id
  const { data } = useSWR(`/api/reports/${runId}/results`, fetcher)
  if (!data) return <div>Loading...</div>
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Report Results</h1>
      <div className="my-4">
        <Link href="/reports">← Back to reports</Link>
      </div>
      <div data-testid="report-results">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  )
}
