import { Novel, Chapter, Category } from './mockData'

const STORAGE_KEY_NOVELS = 'sweetcorn-novels'
const STORAGE_KEY_CHAPTERS = 'sweetcorn-chapters'

function getStoredNovels(): Novel[] {
  const stored = localStorage.getItem(STORAGE_KEY_NOVELS)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }
  return []
}

function getStoredChapters(): Chapter[] {
  const stored = localStorage.getItem(STORAGE_KEY_CHAPTERS)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }
  return []
}

export async function getNovels(category?: string, isShortStory?: boolean): Promise<Novel[]> {
  const stored = getStoredNovels()
  if (stored.length > 0) {
    return stored
  }
  const mock = await import('./mockData').then(m => m.novels)
  localStorage.setItem(STORAGE_KEY_NOVELS, JSON.stringify(mock))
  return mock
}

export async function getNovelById(id: number): Promise<Novel | null> {
  const novels = await getNovels()
  return novels.find(n => n.id === id) || null
}

export async function getChapters(novelId: number): Promise<Chapter[]> {
  const stored = getStoredChapters()
  const filtered = stored.filter(c => c.novelId === novelId)
  if (filtered.length > 0) {
    return filtered
  }
  const mock = await import('./mockData').then(m => m.chapters)
  const novelChapters = mock.filter(c => c.novelId === novelId)
  localStorage.setItem(STORAGE_KEY_CHAPTERS, JSON.stringify(mock))
  return novelChapters
}

export async function getChapterById(id: number): Promise<Chapter | null> {
  const chapters = await getChapters(0)
  return chapters.find(c => c.id === id) || null
}

export async function getCategories(): Promise<Category[]> {
  return import('./mockData').then(m => m.categories)
}

export async function createNovel(novel: Omit<Novel, 'id' | 'createdAt'>): Promise<Novel> {
  const novels = await getNovels()
  const newId = novels.length > 0 ? Math.max(...novels.map(n => n.id)) + 1 : 1
  const newNovel: Novel = {
    ...novel,
    id: newId,
    createdAt: new Date().toISOString().split('T')[0],
  }
  novels.push(newNovel)
  localStorage.setItem(STORAGE_KEY_NOVELS, JSON.stringify(novels))
  return newNovel
}

export async function updateNovel(id: number, updates: Partial<Novel>): Promise<Novel | null> {
  const novels = await getNovels()
  const index = novels.findIndex(n => n.id === id)
  if (index === -1) return null
  novels[index] = { ...novels[index], ...updates }
  localStorage.setItem(STORAGE_KEY_NOVELS, JSON.stringify(novels))
  return novels[index]
}

export async function deleteNovel(id: number): Promise<boolean> {
  const novels = await getNovels()
  const filtered = novels.filter(n => n.id !== id)
  localStorage.setItem(STORAGE_KEY_NOVELS, JSON.stringify(filtered))
  
  const chapters = await getChapters(0)
  const filteredChapters = chapters.filter(c => c.novelId !== id)
  localStorage.setItem(STORAGE_KEY_CHAPTERS, JSON.stringify(filteredChapters))
  
  return true
}

export async function createChapter(chapter: Omit<Chapter, 'id' | 'createdAt'>): Promise<Chapter> {
  const chapters = await getChapters(0)
  const newId = chapters.length > 0 ? Math.max(...chapters.map(c => c.id)) + 1 : 1
  const newChapter: Chapter = {
    ...chapter,
    id: newId,
    createdAt: new Date().toISOString().split('T')[0],
  }
  chapters.push(newChapter)
  localStorage.setItem(STORAGE_KEY_CHAPTERS, JSON.stringify(chapters))
  
  const novels = await getNovels()
  const novelIndex = novels.findIndex(n => n.id === chapter.novelId)
  if (novelIndex !== -1) {
    novels[novelIndex].chapterCount++
    novels[novelIndex].wordCount += chapter.wordCount
    localStorage.setItem(STORAGE_KEY_NOVELS, JSON.stringify(novels))
  }
  
  return newChapter
}