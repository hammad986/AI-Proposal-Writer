export function parseTable(content: string) {
  const rows = content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.includes('|'))
    .map((line) =>
      line
        .split('|')
        .map((cell) => cell.trim())
        .filter(Boolean)
    )
    .filter((row) => row.length > 1)

  const filtered = rows.filter((row) => !row.every((cell) => /^-+$/.test(cell)))
  return {
    headers: filtered[0] || [],
    rows: filtered.slice(1)
  }
}

export function parsePhases(content: string) {
  return content
    .split(/(?=##\s*Phase)/g)
    .map((block, index) => {
      const lines = block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
      const heading = lines[0] || `Phase ${index + 1}`
      const match = heading.match(/##\s*Phase\s*(\d+)?:?\s*(.*?)\s*(?:\((.*?)\))?$/i)
      return {
        number: match?.[1] || String(index + 1),
        name: match?.[2] || heading.replace(/^##\s*/, ''),
        duration: match?.[3] || '',
        tasks: lines
          .slice(1)
          .map((line) => line.replace(/^[-*]\s*/, ''))
          .filter(Boolean)
      }
    })
    .filter((phase) => phase.name)
}

export function renderBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : part
  )
}
