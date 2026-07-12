import { useState, useEffect } from 'react'
import { ArrowLeft, Trash2, Edit3, Plus } from '../icons'
import { getNovels, deleteNovel } from '../api'
import { Novel } from '../mockData'
import { navigate } from '../utils'

export function AdminManage() {
  const [novels, setNovels] = useState<Novel[]>([])

  useEffect(() => {
    loadNovels()
  }, [])

  const loadNovels = async () => {
    const data = await getNovels()
    setNovels(data)
  }

  const handleDelete = async (novelId: number) => {
    if (confirm('确定要删除这本小说吗？')) {
      await deleteNovel(novelId)
      loadNovels()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => navigate('/mine')}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <span className="flex-1 text-center font-bold">小说管理</span>
          <button
            onClick={() => navigate('/admin/publish')}
            className="p-2 -mr-2 hover:bg-gray-100 rounded-full"
          >
            <Plus className="w-6 h-6 text-purple-600" />
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        {novels.length > 0 ? (
          <div className="space-y-3">
            {novels.map(novel => (
              <div key={novel.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex gap-4">
                  <img
                    src={novel.cover}
                    alt={novel.title}
                    className="w-20 h-28 object-cover rounded"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium">{novel.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{novel.author}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded">
                          {novel.category}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          novel.status === '完结' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {novel.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {novel.chapterCount}章 · {novel.wordCount}字
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/admin/publish?id=${novel.id}`)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                          title="编辑"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(novel.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <p>暂无小说</p>
          </div>
        )}
      </div>
    </div>
  )
}