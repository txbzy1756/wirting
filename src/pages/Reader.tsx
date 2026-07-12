import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Settings, List } from '../icons'
import { getNovelById, getChapters } from '../api'
import { Novel, Chapter } from '../mockData'
import { navigate } from '../utils'
import { useStore } from '../store'

export function Reader() {
  const [novel, setNovel] = useState<Novel | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  const [showToc, setShowToc] = useState(false)
  const [settings, setSettings] = useState({
    fontSize: 18,
    theme: 'white',
    lineSpacing: 1.9,
  })
  const [progress, setProgress] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const { updateReadingHistory } = useStore()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const pathParts = window.location.hash.replace(/^#/, '').split('/')
    const novelId = parseInt(pathParts[2] || '')
    const chapterIndex = parseInt(pathParts[3] || '0')
    
    if (!novelId) return
    
    const data = await getNovelById(novelId)
    if (data) {
      setNovel(data)
      const chaps = await getChapters(novelId)
      setChapters(chaps)
      setCurrentChapterIndex(Math.min(chapterIndex, chaps.length - 1))
    }
  }

  useEffect(() => {
    if (novel && chapters.length > 0) {
      calculateProgress()
    }
  }, [currentChapterIndex, progress])

  const calculateProgress = () => {
    if (!novel || chapters.length === 0) return
    
    let totalWords = novel.wordCount
    let readWords = 0
    
    for (let i = 0; i < currentChapterIndex; i++) {
      readWords += chapters[i].wordCount
    }
    
    readWords += Math.floor(chapters[currentChapterIndex].wordCount * (progress / 100))
    const overallProgress = Math.round((readWords / totalWords) * 100)
    
    updateReadingHistory(novel.id, currentChapterIndex, overallProgress)
  }

  const handleScroll = () => {
    if (!contentRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current
    const scrollProgress = ((scrollTop + clientHeight / 2) / scrollHeight) * 100
    setProgress(Math.round(scrollProgress))
  }

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1)
      setProgress(0)
      setTimeout(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    }
  }

  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1)
      setProgress(0)
      setTimeout(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    }
  }

  const currentChapter = chapters[currentChapterIndex]

  const themes = [
    { id: 'white', name: '白色', bg: 'bg-white' },
    { id: 'beige', name: '米色', bg: 'bg-amber-50' },
    { id: 'yellow', name: '护眼', bg: 'bg-lime-100' },
    { id: 'blue', name: '蓝色', bg: 'bg-blue-50' },
    { id: 'dark', name: '深色', bg: 'bg-gray-800' },
  ]

  const themeClasses = {
    white: 'bg-white text-gray-800',
    beige: 'bg-amber-50 text-gray-800',
    yellow: 'bg-lime-100 text-gray-800',
    blue: 'bg-blue-50 text-gray-800',
    dark: 'bg-gray-800 text-gray-300',
  }

  if (!novel || !currentChapter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">加载中...</p>
      </div>
    )
  }

  return (
    <div className={`h-screen ${themeClasses[settings.theme as keyof typeof themeClasses]} relative`}>
      <div className={`absolute inset-0 ${settings.theme === 'dark' ? 'bg-gray-800' : ''}`}>
        <div
          ref={contentRef}
          className="h-screen overflow-y-auto px-4 py-20"
          onScroll={handleScroll}
          onClick={() => setShowMenu(!showMenu)}
          style={{ lineHeight: settings.lineSpacing }}
        >
          <h2 className="text-xl font-bold text-center mb-8">{currentChapter.title}</h2>
          <div className="space-y-6" style={{ fontSize: settings.fontSize }}>
            {currentChapter.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-indent-8">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="text-center text-gray-400 mt-12">
            {currentChapterIndex >= chapters.length - 1 ? '本章已完' : '本章未完'}
          </div>
        </div>
      </div>

      {showMenu && (
        <>
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setShowMenu(false)
                  navigate(`/novel/${novel.id}`)
                }}
                className="p-2 text-white hover:bg-white/20 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="text-white text-sm">
                {currentChapterIndex + 1} / {chapters.length}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowMenu(false)
                    setShowToc(true)
                  }}
                  className="p-2 text-white hover:bg-white/20 rounded-full"
                >
                  <List className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 text-white hover:bg-white/20 rounded-full"
                >
                  <Settings className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between text-white text-xs mb-1">
                <span>{novel.title}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  handlePrevChapter()
                  setShowMenu(false)
                }}
                disabled={currentChapterIndex === 0}
                className={`flex-1 py-3 rounded-lg font-medium ${
                  currentChapterIndex === 0 ? 'bg-gray-500/50 text-gray-400' : 'bg-white text-gray-800'
                }`}
              >
                上一章
              </button>
              <button
                onClick={() => {
                  handleNextChapter()
                  setShowMenu(false)
                }}
                disabled={currentChapterIndex >= chapters.length - 1}
                className={`flex-1 py-3 rounded-lg font-medium ${
                  currentChapterIndex >= chapters.length - 1 ? 'bg-gray-500/50 text-gray-400' : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                }`}
              >
                下一章
              </button>
            </div>
          </div>
        </>
      )}

      {!showMenu && showToc && (
        <div className="absolute inset-0 bg-black/60 flex flex-col" onClick={() => setShowToc(false)}>
          <div className="bg-white rounded-t-lg mt-auto max-h-[70vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-4 border-b flex items-center justify-between">
              <h3 className="font-bold">章节目录</h3>
              <button onClick={() => setShowToc(false)} className="text-gray-400">
                关闭
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(70vh-60px)] p-4">
              <div className="space-y-1">
                {chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    className={`w-full text-left py-2 text-sm rounded ${
                      index === currentChapterIndex ? 'bg-purple-100 text-purple-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setCurrentChapterIndex(index)
                      setProgress(0)
                      setShowToc(false)
                      setTimeout(() => {
                        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
                      }, 100)
                    }}
                  >
                    {chapter.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!showMenu && !showToc && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 rounded-lg p-6 shadow-xl w-80" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-center mb-4">阅读设置</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">字体大小</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSettings(s => ({ ...s, fontSize: Math.max(14, s.fontSize - 2) }))}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  A-
                </button>
                <span className="flex-1 text-center">{settings.fontSize}px</span>
                <button
                  onClick={() => setSettings(s => ({ ...s, fontSize: Math.min(28, s.fontSize + 2) }))}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  A+
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">背景颜色</p>
              <div className="grid grid-cols-5 gap-2">
                {themes.map(theme => (
                  <button
                    key={theme.id}
                    className={`w-10 h-10 rounded-full border-2 ${
                      settings.theme === theme.id ? 'border-purple-500' : 'border-gray-200'
                    } ${theme.bg}`}
                    onClick={() => setSettings(s => ({ ...s, theme: theme.id }))}
                    title={theme.name}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowMenu(false)}
              className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium"
            >
              完成
            </button>
          </div>
        </div>
      )}
    </div>
  )
}