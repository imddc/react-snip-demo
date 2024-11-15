import { createLazyFileRoute } from '@tanstack/react-router'
import html2canvas from 'html2canvas'
import { useState } from 'react'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const [bg, setBg] = useState('')

  // 截图整个body
  async function captureBody() {
    const root = document.getElementById('root')
    if (!root) {
      return ''
    }
    const canvas = await html2canvas(root)
    const bgDataUrl = canvas.toDataURL('image/png')
    return bgDataUrl
  }

  // 开始流程
  async function startCapture() {
    const bgDataUrl = await captureBody()
    setBg(bgDataUrl)
  }

  return (
    <div className="p-2">
      <h3>
        Welcome Home!
        <button type="button" onClick={startCapture}>截图</button>
      </h3>

      <img alt="" src={bg} />
    </div>
  )
}
