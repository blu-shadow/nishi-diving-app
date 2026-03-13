import { Outlet } from 'react-router-dom'
import TopBar   from './TopBar'
import BottomNav from './BottomNav'

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <TopBar />
      <main className="page-wrapper px-4 max-w-lg mx-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
