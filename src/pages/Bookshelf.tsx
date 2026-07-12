import { useState, useEffect } from 'react'
import { BookOpen, Clock, Trash2 } from '../icons'
import { getNovels } from '../api'
import { Novel } from '../mockData'
import { navigate } from '../utils'
import { useStore } from '../store'

export function Bookshelf() {
  const [novels, setNovels] = useState<Novel[]>([])
  const { favorites, readingHistory, removeFavorite } = useStore()

  useEffect(() => {
    loadNovels()
  }, [favorites])

  const loadNovels = async () => {
    const allNovels = await getNovels()
    setNovels(allNovels)
  }

  const favoriteNovels = novels.filter(n => favorites.includes(n.id))
  const historyNovels = novels.filter(n => readingHistory.some(h => h.novelId === n.id))

  const handleNovelClick = (novel: Novel) => {
    const history = readingHistory.find(h => h.novelId === novel.id)
    if (history) {
      navigate(`/reader/${novel.id}/${history.chapterIndex}`)
    } else {
      navigate(`/novel/${novel.id}`)
    }
  }

  const getReadingProgress = (novelId: number): number => {
    const history = readingHistory.find(h => h.novelId === novelId)
    return history?.progress || 0
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <h1 className="text-lg font-bold px-4 py-4">我的书架</h1>
      </div>

      <div className="px-4 py-4">
        <div className="flex items-center mb-3">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <span className="font-medium ml-2">我的收藏</span>
          <span className="text-sm text-gray-400 ml-auto">{favoriteNovels.length}本</span>
        </div>

        {favoriteNovels.length > 0 ? (
          <div className="space-y-3">
            {favoriteNovels.map(novel => (
              <div
                key={novel.id}
                className="bg-white rounded-lg shadow-sm p-3 flex gap-3"
                onClick={() => handleNovelClick(novel)}
              >
                <img
                  src={novel.cover}
                  alt={novel.title}
                  className="w-20 h-28 object-cover rounded"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium">{novel.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{novel.author}</p>
                    <p className="text-xs text-gray-400 mt-1">{novel.category} · {novel.status}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">已读 {getReadingProgress(novel.id)}%</span>
                    </div>
                    <button
                      className="text-gray-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFavorite(novel.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 bg-white rounded-lg">
            <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>暂无收藏</p>
          </div>
        )}

        <div className="flex items-center mb-3 mt-6">
          <Clock className="w-5 h-5 text-purple-600" />
          <span className="font-medium ml-2">阅读历史</span>
        </div>

        {historyNovels.length > 0 ? (
          <div className="space-y-3">
            {historyNovels.map(novel => {
              const history = readingHistory.find(h => h.novelId === novel.id)
              return (
                <div
                  key={novel.id}
                  className="bg-white rounded-lg shadow-sm p-3 flex gap-3"
                  onClick={() => handleNovelClick(novel)}
                >
                  <img
                    src={novel.cover}
                    alt={novel.title}
                    className="w-20 h-28 object-cover rounded"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium">{novel.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{novel.author}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        第{history?.chapterIndex || 1}章
                      </span>
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${getReadingProgress(novel.id)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 bg-white rounded-lg">
            <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>暂无阅读记录</p>
          </div>
        )}
      </div>
    </div>
  )
}