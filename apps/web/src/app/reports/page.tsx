import React from 'react'
import useSWR from 'swr'

const fetcher = (u:string)=>fetch(u).then(r=>r.json())

export default function ReportsPage(){
  const { data } = useSWR('/api/reports', fetcher)
  if (!data) return <div className="container-app">Loading...</div>
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-gray-500">Run and export organizational analytics</p>
      </div>
      <div className="card">
        <ul>
          {data.map((r:any)=>(
            <li key={r.id} className="list-item flex items-center justify-between" data-testid={`report-${r.id}`}>
              <div>
                <div className="font-semibold">{r.title}</div>
                <div className="text-sm text-gray-500">{r.description}</div>
              </div>
              <div>
                <button className="btn-primary">Run</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
