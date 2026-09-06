import React from 'react'
import useSWR from 'swr'

const fetcher = (u:string)=>fetch(u).then(r=>r.json())

export default function PlansPage(){
  const { data } = useSWR('/api/development-plans', fetcher)
  // endpoint may return placeholder — render message
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">My Development Plans</h1>
      <div data-testid="devplans-list">(Plans placeholder)</div>
    </div>
  )
}
