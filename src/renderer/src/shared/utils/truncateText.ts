export const truncateText = (length: number, description?: string) => {
  if (!description) return ''
  return description.slice(0, length)
}