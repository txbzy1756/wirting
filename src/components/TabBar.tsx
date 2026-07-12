import { Home, BookOpen, User } from '../icons'
import { navigate } from '../utils'

interface TabBarProps {
  current: string
}

export function TabBar({ current }: TabBarProps) {
  const tabs = [
    { path: '/', label: '首页', icon: Home },
    { path: '/bookshelf', label: '书架', icon: BookOpen },
    { path: '/mine', label: '我的', icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = current === tab.path
          return (
            <button
              key={tab.path}
              className={`flex-1 py-2 flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-purple-600' : 'text-gray-400'
              }`}
              onClick={() => navigate(tab.path)}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}