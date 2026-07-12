import { useState } from 'react'
import { User, Settings, BookOpen, LogOut, Login, Pencil } from '../icons'
import { useStore } from '../store'
import { navigate } from '../utils'

export function Mine() {
  const { user, login, logout } = useStore()
  const [showLogin, setShowLogin] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
    if (!username || !password) {
      setError('请输入用户名和密码')
      return
    }
    const success = await login(username, password)
    if (success) {
      setShowLogin(false)
      setUsername('')
      setPassword('')
    } else {
      setError('用户名或密码错误')
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.nickname || '游客'}</h2>
            <p className="text-sm opacity-80">{user?.isAdmin ? '管理员' : ''}</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {user ? (
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <button className="text-center" onClick={() => navigate('/bookshelf')}>
                  <BookOpen className="w-8 h-8 mx-auto text-purple-600" />
                  <p className="text-xs text-gray-500 mt-2">我的书架</p>
                </button>
                {user.isAdmin && (
                  <>
                    <button className="text-center" onClick={() => navigate('/admin/publish')}>
                      <Pencil className="w-8 h-8 mx-auto text-pink-500" />
                      <p className="text-xs text-gray-500 mt-2">发布小说</p>
                    </button>
                    <button className="text-center" onClick={() => navigate('/admin/manage')}>
                      <Settings className="w-8 h-8 mx-auto text-blue-500" />
                      <p className="text-xs text-gray-500 mt-2">管理小说</p>
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <button
              className="w-full p-4 flex items-center justify-center gap-2 text-purple-600 font-medium"
              onClick={() => setShowLogin(true)}
            >
              <Login className="w-5 h-5" />
              <span>登录/注册</span>
            </button>
          )}
        </div>

        {user && (
          <div className="bg-white rounded-lg shadow-sm mt-3">
            <button
              className="w-full p-4 flex items-center justify-between text-gray-600"
              onClick={handleLogout}
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                <span>退出登录</span>
              </div>
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm mt-3 p-4">
          <h3 className="font-medium mb-3">关于我们</h3>
          <p className="text-sm text-gray-500">
            甜玉米小说是一个专注于提供优质小说阅读体验的平台。
            我们致力于为读者提供丰富多样的小说内容，让阅读成为一种享受。
          </p>
          <p className="text-xs text-gray-400 mt-3">版本: 1.0.0</p>
        </div>
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-bold mb-4">欢迎来到甜玉米小屋</h3>
            {error && (
              <p className="text-red-500 text-sm mb-3">{error}</p>
            )}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="输入用户名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="输入密码"
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700"
              >
                登录
              </button>
              <button
                onClick={() => setShowLogin(false)}
                className="w-full text-gray-500 py-2"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}