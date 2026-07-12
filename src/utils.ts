export function navigate(path: string): void {
  window.location.hash = path
}

export function getPathParts(): string[] {
  const hash = window.location.hash.replace(/^#/, '')
  return hash.split('/').filter(p => p)
}