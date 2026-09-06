import React from 'react'
import useSWR from 'swr'

const fetcher = (u:string)=>fetch(u).then(r=>r.json())

export default function ReportsPage(){
  const { data } = useSWR('/api/reports', fetcher)
  if (!data) return <div>Loading...</div>
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      <ul>
        {data.map((r:any)=>(
          <li key={r.id} className="py-2" data-testid={`report-${r.id}`}>
            <div className="font-semibold">{r.title}</div>
            <div className="text-sm text-gray-600">{r.description}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
