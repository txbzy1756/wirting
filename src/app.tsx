import { useEffect, useState } from 'react'
import './app.scss'
import { Home } from './pages/Home'
import { Bookshelf } from './pages/Bookshelf'
import { Mine } from './pages/Mine'
import { AdminManage } from './pages/AdminManage'
import { AdminPublish } from './pages/AdminPublish'
import { NovelDetail } from './pages/NovelDetail'
import { Reader } from './pages/Reader'
import { TabBar } from './components/TabBar'
import { useStore } from './store'

function App() {
  const { getUserProfile } = useStore()
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    getUserProfile()
  }, [getUserProfile])

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const path = hash.replace(/^#/, '') || '/'

  const showTabBar = !path.startsWith('/novel/') && 
                     !path.startsWith('/reader/') && 
                     !path.startsWith('/admin/')

  if (path === '/bookshelf') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Bookshelf />
        {showTabBar && <TabBar current="/bookshelf" />}
      </div>
    )
  }

  if (path === '/mine') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Mine />
        {showTabBar && <TabBar current="/mine" />}
      </div>
    )
  }

  if (path === '/admin/manage') {
    return <AdminManage />
  }

  if (path === '/admin/publish') {
    return <AdminPublish />
  }

  if (path.startsWith('/novel/')) {
    return <NovelDetail />
  }

  if (path.startsWith('/reader/')) {
    return <Reader />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Home />
      {showTabBar && <TabBar current="/" />}
    </div>
  )
}

export default App