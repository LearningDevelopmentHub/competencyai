import React from 'react'
import useSWR from 'swr'

const fetcher = (u:string)=>fetch(u).then(r=>r.json())

export default function ResourcesPage(){
  const { data } = useSWR('/api/learning/resources', fetcher)
  if (!data) return <div>Loading...</div>
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Learning Resources</h1>
      <ul>
        {data.map((r:any)=> (
          <li key={r.id} data-testid={`resource-${r.id}`} className="py-2">{r.title?.en || r.url} - {r.provider}</li>
        ))}
      </ul>
    </div>
  )
}
