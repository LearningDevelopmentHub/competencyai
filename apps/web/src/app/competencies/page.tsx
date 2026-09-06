import React from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function CompetenciesPage(){
  const { data, error } = useSWR('/api/competencies', fetcher)
  if (error) return <div className="container-app">Failed to load</div>
  if (!data) return <div className="container-app">Loading...</div>
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Competencies</h1>
        <p className="text-sm text-gray-500">Danh sách năng lực (EN/VI)</p>
      </div>

      <div className="card">
        <ul>
          {data.map((c:any)=> (
            <li key={c.id} data-testid={`competency-${c.code}`} className="list-item flex items-center justify-between">
              <div>
                <div className="font-semibold">{c.currentVersion?.title?.en || c.code}</div>
                <div className="text-sm text-gray-500">{c.code}</div>
              </div>
              <div>
                <button className="btn-primary" aria-label={`Open ${c.code}`}>Open</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 card">
        <h2 className="text-xl font-semibold mb-3">Dendrogram</h2>
        <div style={{ width: '100%', height: 420 }}>
          {/* dendrogram renders here */}
          <div data-testid="dendrogram-placeholder" className="text-sm text-gray-500">Interactive tree (client-side)</div>
        </div>
      </div>
    </div>
  )
}
