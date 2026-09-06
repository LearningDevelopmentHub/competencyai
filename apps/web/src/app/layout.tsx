'use client'
import './globals.css'
import React, { useEffect, useState } from 'react'

export default function RootLayout({ children }:{ children: React.ReactNode }){
  const [theme, setTheme] = useState<'light'|'dark'>('light')
  useEffect(()=>{
    try{
      const stored = localStorage.getItem('theme') as 'light'|'dark'|null
      if (stored){
        setTheme(stored)
        document.documentElement.classList.toggle('dark', stored === 'dark')
      } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        const initial = prefersDark ? 'dark' : 'light'
        setTheme(initial)
        document.documentElement.classList.toggle('dark', initial === 'dark')
      }
    }catch(e){ /* ignore */ }
  },[])

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    try{ localStorage.setItem('theme', next) }catch(e){}
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  return (
    <html lang="vi">
      <body className="min-h-screen">
        <header className="w-full border-b" style={{ borderColor: 'rgba(15,23,42,0.04)'}}>
          <div className="container-app flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div style={{ width:36, height:36, background: 'var(--color-primary)', borderRadius:8 }} aria-hidden></div>
              <div>
                <div style={{ fontWeight:700 }}>CompetencyAI</div>
                <div style={{ fontSize:12, color:'var(--color-muted)' }}>Admin panel</div>
              </div>
            </div>
            <div>
              <button onClick={toggle} className="btn-primary" aria-label="Toggle theme">{theme==='light' ? 'Dark' : 'Light'}</button>
            </div>
          </div>
        </header>
        <main className="container-app spacious">
          {children}
        </main>
        <footer className="container-app py-6 text-sm text-gray-500">
          <div>© {new Date().getFullYear()} CompetencyAI</div>
        </footer>
      </body>
    </html>
  )
}
