import React from 'react'
import dynamic from 'next/dynamic'
import useSWR from 'swr'

const Tree = dynamic(() => import('../../components/dendrogram'), { ssr: false })

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function CompetenciesPage(){
  const { data, error } = useSWR('/api/competencies', fetcher)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Competencies</h1>
      <ul>
        {data.map((c:any)=> (
          <li key={c.id} data-testid={`competency-${c.code}`} className="py-2">{c.currentVersion?.title?.en || c.code}</li>
        ))}
      </ul>
      <div className="mt-6">
        <h2 className="text-xl">Dendrogram</h2>
        <div style={{ width: '100%', height: 500 }}>
          <Tree data={data} />
        </div>
      </div>
    </div>
  )
}
