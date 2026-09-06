import React from 'react'
import useSWR from 'swr'

const fetcher = (u:string)=>fetch(u).then(r=>r.json())

export default function JobArchitecturePage(){
  const { data } = useSWR('/api/job-families', fetcher)
  if (!data) return <div className="container-app">Loading...</div>
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Job Architecture</h1>
        <p className="text-sm text-gray-500">Families & levels overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((f:any)=>(
          <div key={f.id} className="card" data-testid={`jobfamily-${f.code}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{f.name?.en}</div>
                <div className="text-sm text-gray-500">Levels: {f.jobLevels?.length || 0}</div>
              </div>
              <div>
                <button className="btn-primary">View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
