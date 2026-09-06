import React from 'react'
import useSWR from 'swr'

const fetcher = (u:string)=>fetch(u).then(r=>r.json())

export default function CampaignsPage(){
  const { data } = useSWR('/api/campaigns', fetcher)
  if (!data) return <div>Loading...</div>
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Assessment Campaigns</h1>
      <div data-testid="campaigns-list">(Campaigns list placeholder)</div>
    </div>
  )
}
