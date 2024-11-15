import { createLazyFileRoute } from '@tanstack/react-router'
import html2canvas from 'html2canvas'
import { useEffect, useRef, useState } from 'react'
import ToolBox from '@/components/ToolBox'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [isCapturing, setIsCapturing] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [bgDataUrl, setBgDataUrl] = useState('')
  const [startPoint, setStartPoint] = useState<{ x: number, y: number } | null>(null)
  const [endPoint, setEndPoint] = useState<{ x: number, y: number } | null>(null)

  const [isShowToolBox, setIsShowToolBox] = useState(false)
  const [toolBoxPosition, setToolBoxPosition] = useState<{ x: number, y: number } | null>(null)

  // 截图整个body
  async function captureBody() {
    const root = document.getElementById('root')
    if (!root) {
      return ''
    }
    const canvas = await html2canvas(root)
    const bgDataUrl = canvas.toDataURL('image/png')
    setBgDataUrl(bgDataUrl)
  }

  function setCanvasBg(bgDataUrl: string) {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) {
      return
    }
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
    }
    img.src = bgDataUrl
  }

  function setCanvasMask(maskColor?: string) {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) {
      return
    }
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = maskColor || 'rgba(0, 0, 0, 0.3)'
    ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
  }

  function drawRect(startPoint: { x: number, y: number }, endPoint: { x: number, y: number }) {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) {
      return
    }
    // 绘制虚线,内部填充透明色 忽略遮罩层的颜色
    ctx.globalCompositeOperation = 'destination-out'
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 0.5
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.setLineDash([10, 5])
    ctx.fillRect(startPoint.x, startPoint.y, endPoint.x - startPoint.x, endPoint.y - startPoint.y)
    ctx.strokeRect(startPoint.x, startPoint.y, endPoint.x - startPoint.x, endPoint.y - startPoint.y)
    ctx.globalCompositeOperation = 'source-over'
    ctx.stroke()
  }

  function clearCanvas() {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) {
      return
    }
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
  }

  function mouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    setIsShowToolBox(false)
    setIsDrawing(true)
    setStartPoint({ x: e.clientX, y: e.clientY })
  }

  function mouseUp() {
    setIsDrawing(false)

    // TODO: 显示工具栏
    const bottom = Math.max(endPoint?.y || 0, startPoint?.y || 0)
    const right = Math.max(endPoint?.x || 0, startPoint?.x || 0)

    setToolBoxPosition({ x: right - 80, y: bottom + 20 })
    setIsShowToolBox(true)

    setStartPoint(null)
    setEndPoint(null)
  }

  function mouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing) {
      return
    }
    setEndPoint({ x: e.clientX, y: e.clientY })
    draw()
  }

  function draw() {
    clearCanvas()
    setCanvasBg(bgDataUrl)
    setCanvasMask()

    if (!canvasRef.current || !startPoint || !endPoint) {
      return
    }
    drawRect(startPoint, endPoint)
  }

  // 开始流程
  async function startCapture() {
    await captureBody()
    draw()
    setIsCapturing(true)
  }

  useEffect(() => {
    if (isDrawing && startPoint && endPoint) {
      drawRect(startPoint, endPoint)
    }
  }, [isDrawing, startPoint, endPoint])

  return (
    <div className="p-2">
      <h3>
        Welcome Home!
        <button className="ml-2 rounded bg-blue-500 px-2 py-1 text-white" type="button" onClick={startCapture}>
          截图
        </button>
      </h3>
      {isCapturing && (
        <canvas
          ref={canvasRef}
          className="fixed left-0 top-0 z-40 size-full"
          height={window.innerHeight}
          width={window.innerWidth}
          onMouseDown={mouseDown}
          onMouseMove={mouseMove}
          onMouseUp={mouseUp}
        />
      )}
      {isShowToolBox && toolBoxPosition && (
        <ToolBox
          position={toolBoxPosition}
        />
      )}
    </div>
  )
}
