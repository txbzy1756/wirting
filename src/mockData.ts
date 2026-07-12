export interface Novel {
  id: number
  title: string
  author: string
  cover: string
  description: string
  category: string
  status: string
  wordCount: number
  chapterCount: number
  createdAt: string
  isShortStory: boolean
}

export interface Chapter {
  id: number
  novelId: number
  title: string
  content: string
  wordCount: number
  createdAt: string
}

export interface Category {
  id: number
  name: string
  icon: string
}

export const categories: Category[] = [
  { id: 1, name: '校园', icon: 'school' },
  { id: 2, name: '都市', icon: 'city' },
  { id: 3, name: '奇幻', icon: 'sparkles' },
  { id: 4, name: '悬疑', icon: 'search' },
  { id: 5, name: '古风', icon: 'scroll' },
  { id: 6, name: '现代', icon: 'building' },
]

export const novels: Novel[] = [
  {
    id: 1,
    title: '校园初恋日记',
    author: '米米',
    cover: 'https://picsum.photos/seed/school1/300/400',
    description: '青春校园里的纯真爱情故事，记录了一段美好的初恋时光。',
    category: '校园',
    status: '完结',
    wordCount: 125000,
    chapterCount: 25,
    createdAt: '2024-01-15',
    isShortStory: false,
  },
  {
    id: 2,
    title: '都市夜行者',
    author: '米米',
    cover: 'https://picsum.photos/seed/city1/300/400',
    description: '繁华都市背后的秘密，一个神秘的夜晚守护者的故事。',
    category: '都市',
    status: '连载中',
    wordCount: 89000,
    chapterCount: 18,
    createdAt: '2024-02-20',
    isShortStory: false,
  },
  {
    id: 3,
    title: '喵喵王国大冒险',
    author: '米米',
    cover: 'https://picsum.photos/seed/miao1/300/400',
    description: '一个由猫咪统治的奇幻王国，充满了冒险和惊喜。',
    category: '奇幻',
    status: '完结',
    wordCount: 56000,
    chapterCount: 12,
    createdAt: '2024-03-10',
    isShortStory: false,
  },
  {
    id: 4,
    title: '迷雾中的真相',
    author: '米米',
    cover: 'https://picsum.photos/seed/mystery1/300/400',
    description: '一桩离奇的失踪案，揭开了尘封多年的秘密。',
    category: '悬疑',
    status: '连载中',
    wordCount: 72000,
    chapterCount: 15,
    createdAt: '2024-04-05',
    isShortStory: false,
  },
  {
    id: 5,
    title: '锦绣山河',
    author: '米米',
    cover: 'https://picsum.photos/seed/ancient1/300/400',
    description: '古风言情小说，讲述了一段跨越阶层的爱情故事。',
    category: '古风',
    status: '完结',
    wordCount: 156000,
    chapterCount: 30,
    createdAt: '2024-05-20',
    isShortStory: false,
  },
  {
    id: 6,
    title: '命运交响曲',
    author: '米米',
    cover: 'https://picsum.photos/seed/modern1/300/400',
    description: '现代都市中的命运交织，每个人都在寻找自己的方向。',
    category: '现代',
    status: '连载中',
    wordCount: 98000,
    chapterCount: 20,
    createdAt: '2024-06-15',
    isShortStory: false,
  },
]

export const chapters: Chapter[] = []

for (let n = 1; n <= 6; n++) {
  const novel = novels[n - 1]
  const chapterCount = novel.chapterCount
  const wordsPerChapter = Math.floor(novel.wordCount / chapterCount)
  
  for (let c = 1; c <= chapterCount; c++) {
    const paragraphs = []
    const paragraphCount = 5 + Math.floor(Math.random() * 5)
    
    for (let p = 0; p < paragraphCount; p++) {
      const sentences = []
      const sentenceCount = 3 + Math.floor(Math.random() * 5)
      
      for (let s = 0; s < sentenceCount; s++) {
        const wordCount = 8 + Math.floor(Math.random() * 15)
        const words = []
        
        for (let w = 0; w < wordCount; w++) {
          words.push(getRandomWord())
        }
        
        sentences.push(words.join('') + '。')
      }
      
      paragraphs.push(sentences.join(''))
    }
    
    chapters.push({
      id: (n - 1) * 100 + c,
      novelId: n,
      title: `第${c}章 ${getRandomTitle()}`,
      content: paragraphs.join('\n\n'),
      wordCount: wordsPerChapter,
      createdAt: '2024-01-15',
    })
  }
}

function getRandomWord(): string {
  const chars = '的一是不了人我有他这为之大来上个国到说们时地出会家可下而子就你着年生自后前道然天于思定成者方多经么去法学如都同当无动面起看定所理小现实加量还两制机使点从业本去把性好应开它合因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价飞严量'
  return chars[Math.floor(Math.random() * chars.length)]
}

function getRandomTitle(): string {
  const titles = [
    '相遇', '离别', '重逢', '秘密', '真相', '冒险', '成长', '抉择',
    '回忆', '未来', '梦想', '现实', '勇气', '希望', '迷茫', '坚定',
    '爱情', '友情', '亲情', '背叛', '信任', '守护', '追寻', '探索',
  ]
  return titles[Math.floor(Math.random() * titles.length)]
}