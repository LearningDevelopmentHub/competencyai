import React, { useRef, useEffect } from 'react'
import Tree from 'react-d3-tree'

export default function Dendrogram({ data }:{ data:any[] }){
  // convert flat competency list to simple tree grouped by first letter as example
  const root = { name: 'Competencies', children: [] as any[] }
  const groups:Record<string, any> = {}
  data.forEach((c:any)=>{
    const k = (c.currentVersion?.title?.en || c.code)[0] || '#'
    if (!groups[k]) groups[k] = { name: k, children: [] }
    groups[k].children.push({ name: c.currentVersion?.title?.en || c.code, attributes: { id: c.id } })
  })
  root.children = Object.values(groups)

  return (
    <div id="treeWrapper" style={{ width: '100%', height: '100%' }}>
      <Tree data={root} orientation="vertical" zoomable allowForeignObjects />
    </div>
  )
}
