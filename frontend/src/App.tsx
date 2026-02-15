import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Toaster } from 'sonner'
import { Layout } from './components/layout/Layout'
import { LoadingSpinner } from './components/ui/LoadingSpinner'

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const Explore = lazy(() => import('./pages/Explore'))
const LocationDetail = lazy(() => import('./pages/LocationDetail'))
const Itinerary = lazy(() => import('./pages/Itinerary'))
const Profile = lazy(() => import('./pages/Profile'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Recommendations = lazy(() => import('./pages/Recommendations'))

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Suspense fallback={<LoadingSpinner />}><Home /></Suspense>} />
          <Route path="explore" element={<Suspense fallback={<LoadingSpinner />}><Explore /></Suspense>} />
          <Route path="location/:id" element={<Suspense fallback={<LoadingSpinner />}><LocationDetail /></Suspense>} />
          <Route path="itinerary" element={<Suspense fallback={<LoadingSpinner />}><Itinerary /></Suspense>} />
          <Route path="profile" element={<Suspense fallback={<LoadingSpinner />}><Profile /></Suspense>} />
          <Route path="recommendations" element={<Suspense fallback={<LoadingSpinner />}><Recommendations /></Suspense>} />
        </Route>
        <Route path="/login" element={<Suspense fallback={<LoadingSpinner />}><Login /></Suspense>} />
        <Route path="/register" element={<Suspense fallback={<LoadingSpinner />}><Register /></Suspense>} />
      </Routes>
      <Toaster position="top-right" />
    </>
  )
}

export default App
