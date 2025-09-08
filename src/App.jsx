import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { Home } from './pages/Home'
import { Providers } from './pages/Providers'
import { UrgentCare } from './pages/UrgentCare'
import { Programs } from './pages/Programs'
import { Appointments } from './pages/Appointments'
import { Profile } from './pages/Profile'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/urgent-care" element={<UrgentCare />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </AppShell>
      </DataProvider>
    </AuthProvider>
  )
}

export default App