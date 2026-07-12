import { useState, useEffect } from 'react'
import { ArrowLeft, Upload, X } from '../icons'
import { getCategories, createNovel, createChapter, getNovelById, updateNovel } from '../api'
import { Category } from '../mockData'
import { navigate } from '../utils'

export function AdminPublish() {
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover: '',
    description: '',
    category: '',
    status: '连载中',
    isShortStory: false,
    chapterTitle: '',
    chapterContent: '',
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const cats = await getCategories()
    setCategories(cats)
    if (cats.length > 0) {
      setFormData(f => ({ ...f, category: cats[0].name }))
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(f => ({ ...f, cover: reader.result as string }))
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch {
      setUploading(false)
      alert('图片上传失败')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('请输入小说标题')
      return
    }
    if (!formData.description.trim()) {
      alert('请输入小说简介')
      return
    }

    const novelData = {
      title: formData.title.trim(),
      author: formData.author.trim() || '米米',
      cover: formData.cover || 'https://picsum.photos/seed/novel1/300/400',
      description: formData.description.trim(),
      category: formData.category,
      status: formData.isShortStory ? '完结' : formData.status,
      wordCount: formData.chapterContent.length,
      chapterCount: 1,
      isShortStory: formData.isShortStory,
    }

    try {
      const novel = await createNovel(novelData)
      
      await createChapter({
        novelId: novel.id,
        title: formData.chapterTitle.trim() || '第1章 开始',
        content: formData.chapterContent.trim(),
        wordCount: formData.chapterContent.length,
      })

      alert('发布成功！')
      navigate('/admin/manage')
    } catch {
      alert('发布失败，请重试')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => navigate('/admin/manage')}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <span className="flex-1 text-center font-bold">发布小说</span>
          <div className="w-10" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-medium mb-3">基本信息</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="输入小说标题"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">作者</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData(f => ({ ...f, author: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="默认：米米"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">封面</label>
              <div className="relative">
                {formData.cover ? (
                  <div className="relative">
                    <img
                      src={formData.cover}
                      alt="封面"
                      className="w-24 h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(f => ({ ...f, cover: '' }))}
                      className="absolute top-0 right-0 bg-black/50 text-white p-1 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-24 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500">上传封面</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>
              {uploading && <p className="text-sm text-gray-500 mt-2">上传中...</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(f => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    checked={!formData.isShortStory}
                    onChange={() => setFormData(f => ({ ...f, isShortStory: false }))}
                    className="text-purple-600"
                  />
                  <span>长篇小说</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    checked={formData.isShortStory}
                    onChange={() => setFormData(f => ({ ...f, isShortStory: true, status: '完结' }))}
                    className="text-purple-600"
                  />
                  <span>短篇故事</span>
                </label>
              </div>
            </div>

            {!formData.isShortStory && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="连载中">连载中</option>
                  <option value="完结">完结</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">简介 *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="输入小说简介"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-medium mb-3">章节内容</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">章节标题</label>
              <input
                type="text"
                value={formData.chapterTitle}
                onChange={(e) => setFormData(f => ({ ...f, chapterTitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="第1章 开始"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">章节内容</label>
              <textarea
                value={formData.chapterContent}
                onChange={(e) => setFormData(f => ({ ...f, chapterContent: e.target.value }))}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="输入章节内容..."
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700"
        >
          发布小说
        </button>
      </form>
    </div>
  )
}