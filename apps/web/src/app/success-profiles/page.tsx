import React from 'react'
import useSWR from 'swr'

const fetcher = (u:string)=>fetch(u).then(r=>r.json())

export default function SuccessProfilesPage(){
  const { data } = useSWR('/api/success-profiles', fetcher)
  if (!data) return <div>Loading...</div>
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Success Profiles</h1>
      <div data-testid="success-profiles-list">(Profile list placeholder)</div>
    </div>
  )
}
