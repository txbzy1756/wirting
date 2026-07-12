import { useState, useEffect } from 'react'
import { ArrowLeft, Heart, BookOpen, ChevronRight } from '../icons'
import { getNovelById, getChapters } from '../api'
import { Novel, Chapter } from '../mockData'
import { navigate } from '../utils'
import { useStore } from '../store'

export function NovelDetail() {
  const [novel, setNovel] = useState<Novel | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [showChapters, setShowChapters] = useState(false)
  const { favorites, addFavorite, removeFavorite } = useStore()

  useEffect(() => {
    loadNovel()
  }, [])

  const loadNovel = async () => {
    const pathParts = window.location.hash.replace(/^#/, '').split('/')
    const novelId = parseInt(pathParts[2] || '')
    if (!novelId) return
    
    const data = await getNovelById(novelId)
    if (data) {
      setNovel(data)
      const chaps = await getChapters(novelId)
      setChapters(chaps)
    }
  }

  if (!novel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">加载中...</p>
      </div>
    )
  }

  const isFavorite = favorites.includes(novel.id)

  const handleRead = () => {
    if (chapters.length > 0) {
      navigate(`/reader/${novel.id}/0`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <span className="flex-1 text-center font-medium">小说详情</span>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 flex gap-4">
            <img
              src={novel.cover}
              alt={novel.title}
              className="w-28 h-40 object-cover rounded"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h1 className="text-xl font-bold">{novel.title}</h1>
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
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{novel.chapterCount}章</span>
                <span>·</span>
                <span>{formatWordCount(novel.wordCount)}</span>
              </div>
            </div>
          </div>

          <div className="px-4 pb-4">
            <p className="text-sm text-gray-600 line-clamp-3">{novel.description}</p>
          </div>

          <div className="px-4 pb-4 flex gap-3">
            <button
              className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                isFavorite ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => isFavorite ? removeFavorite(novel.id) : addFavorite(novel.id)}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
              {isFavorite ? '已收藏' : '收藏'}
            </button>
            <button
              className="flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 bg-purple-600 text-white"
              onClick={handleRead}
            >
              <BookOpen className="w-5 h-5" />
              开始阅读
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mt-3">
          <button
            className="w-full px-4 py-4 flex items-center justify-between"
            onClick={() => setShowChapters(!showChapters)}
          >
            <span className="font-medium">章节目录</span>
            <ChevronRight className={`w-5 h-5 transition-transform ${showChapters ? 'rotate-90' : ''}`} />
          </button>
          
          {showChapters && (
            <div className="px-4 pb-4">
              <div className="space-y-1">
                {chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    className="w-full text-left py-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
                    onClick={() => navigate(`/reader/${novel.id}/${index}`)}
                  >
                    {chapter.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function formatWordCount(count: number): string {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count.toString()
}