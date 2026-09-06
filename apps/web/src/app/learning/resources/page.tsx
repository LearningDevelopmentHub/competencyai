import React from 'react'
import useSWR from 'swr'

const fetcher = (u:string)=>fetch(u).then(r=>r.json())

export default function ResourcesPage(){
  const { data } = useSWR('/api/learning/resources', fetcher)
  if (!data) return <div className="container-app">Loading...</div>
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Learning Resources</h1>
        <p className="text-sm text-gray-500">Courses, content and ILT sessions</p>
      </div>
      <div className="card">
        <ul>
          {data.map((r:any)=> (
            <li key={r.id} data-testid={`resource-${r.id}`} className="list-item flex items-center justify-between">
              <div>
                <div className="font-semibold">{r.title?.en || r.url}</div>
                <div className="text-sm text-gray-500">{r.provider}</div>
              </div>
              <div>
                <a className="btn-primary" href={r.url} target="_blank" rel="noreferrer">Open</a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
