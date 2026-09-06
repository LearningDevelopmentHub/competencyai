import React from 'react'
import useSWR from 'swr'

const fetcher = (u:string)=>fetch(u).then(r=>r.json())

export default function JobArchitecturePage(){
  const { data } = useSWR('/api/job-families', fetcher)
  if (!data) return <div>Loading...</div>
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Job Architecture</h1>
      <ul>
        {data.map((f:any)=>(
          <li key={f.id} className="py-2" data-testid={`jobfamily-${f.code}`}>
            <div className="font-semibold">{f.name?.en}</div>
            <div className="text-sm text-gray-600">Levels: {f.jobLevels?.length || 0}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
