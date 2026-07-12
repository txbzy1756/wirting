import { useState, useEffect } from 'react'
import { Book, Heart } from '../icons'
import { getNovels, getCategories } from '../api'
import { Novel, Category } from '../mockData'
import { navigate } from '../utils'
import { useStore } from '../store'

export function Home() {
  const [novels, setNovels] = useState<Novel[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'novel' | 'short'>('novel')
  const { favorites } = useStore()

  useEffect(() => {
    loadData()
  }, [activeCategory, activeTab])

  const loadData = async () => {
    const allNovels = await getNovels()
    const cats = await getCategories()
    setCategories(cats)
    
    let filtered = allNovels
    if (activeCategory) {
      filtered = filtered.filter(n => n.category === activeCategory)
    }
    if (activeTab === 'short') {
      filtered = filtered.filter(n => n.isShortStory)
    } else {
      filtered = filtered.filter(n => !n.isShortStory)
    }
    setNovels(filtered)
  }

  const handleNovelClick = (novel: Novel) => {
    navigate(`/novel/${novel.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-6">
        <h1 className="text-2xl font-bold">甜玉米小说</h1>
        <p className="text-sm opacity-80 mt-1">发现精彩故事</p>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === 'novel' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('novel')}
        >
          长篇小说
        </button>
        <button
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === 'short' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('short')}
        >
          短篇故事
        </button>
      </div>

      <div className="px-4 py-3 overflow-x-auto whitespace-nowrap">
        <button
          className={`inline-block px-4 py-1.5 rounded-full text-sm mr-2 transition-colors ${
            !activeCategory ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
          onClick={() => setActiveCategory('')}
        >
          全部
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`inline-block px-4 py-1.5 rounded-full text-sm mr-2 transition-colors ${
              activeCategory === cat.name ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => setActiveCategory(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="px-4 py-3">
        <div className="grid grid-cols-2 gap-3">
          {novels.map(novel => (
            <div
              key={novel.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
              onClick={() => handleNovelClick(novel)}
            >
              <div className="relative">
                <img
                  src={novel.cover}
                  alt={novel.title}
                  className="w-full h-32 object-cover"
                />
                <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                  {novel.status}
                </span>
                {favorites.includes(novel.id) && (
                  <Heart className="absolute top-2 right-2 w-5 h-5 text-red-500 fill-red-500" />
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm line-clamp-2">{novel.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{novel.author}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">{novel.category}</span>
                  <span className="text-xs text-gray-400">{formatWordCount(novel.wordCount)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {novels.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <Book className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>暂无小说</p>
          </div>
        )}
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