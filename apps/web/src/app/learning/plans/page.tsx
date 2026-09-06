import React from 'react'

export default function PlansPage(){
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Development Plans</h1>
        <p className="text-sm text-gray-500">Create and track your learning goals</p>
      </div>
      <div className="card">
        <div data-testid="devplans-list">(Plans placeholder)</div>
      </div>
    </div>
  )
}
