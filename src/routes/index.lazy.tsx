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
  const [bgCanvas, setBgCanvas] = useState<HTMLCanvasElement | null>(null)
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
    const canvas = await html2canvas(root, {
      useCORS: true,
    })
    setBgCanvas(canvas)
  }

  function setCanvasBg() {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) {
      return
    }
    ctx.drawImage(bgCanvas!, 0, 0)
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

  function clearCanvas() {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) {
      return
    }
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
  }

  function mouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    resetCanvas()
    resetPoint()
    setIsShowToolBox(false)
    setIsDrawing(true)
    setStartPoint({ x: e.clientX, y: e.clientY })
  }

  function mouseUp() {
    setIsDrawing(false)

    const bottom = Math.max(endPoint?.y || 0, startPoint?.y || 0)
    const right = Math.max(endPoint?.x || 0, startPoint?.x || 0)

    setToolBoxPosition({ x: right - 110, y: bottom + 20 })
    if (startPoint && endPoint && Math.abs(startPoint.x - endPoint.x) > 10 && Math.abs(startPoint.y - endPoint.y) > 10
    ) {
      setIsShowToolBox(true)
    }
    else {
      handleCancel()
    }
  }

  function mouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing) {
      return
    }
    setEndPoint({ x: e.clientX, y: e.clientY })
  }

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) {
      return
    }
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    ctx.drawImage(bgCanvas!, 0, 0)

    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)

    if (!startPoint || !endPoint) {
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
  }, [bgCanvas, startPoint, endPoint])

  // 开始流程
  async function startCapture() {
    await captureBody()
    resetCanvas()
    setIsCapturing(true)
  }

  function resetPoint() {
    setStartPoint(null)
    setEndPoint(null)
  }

  function resetCanvas() {
    clearCanvas()
    setCanvasBg()
    setCanvasMask()
  }

  function handleCancel() {
    resetCanvas()
    resetPoint()
    setIsShowToolBox(false)
    setIsCapturing(false)
  }

  function handleSave() {
    // TODO: 保存截图
    // 获取截取的指定区域
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    if (!startPoint || !endPoint) {
      return
    }
    canvas.width = Math.abs(startPoint.x - endPoint.x)
    canvas.height = Math.abs(startPoint.y - endPoint.y)
    ctx.drawImage(
      canvasRef.current!,
      Math.min(startPoint.x, endPoint.x),
      Math.min(startPoint.y, endPoint.y),
      Math.abs(startPoint.x - endPoint.x),
      Math.abs(startPoint.y - endPoint.y),
      0,
      0,
      canvas.width,
      canvas.height,
    )
    const dataUrl = canvas.toDataURL('image/png')

    const a = document.createElement('a')
    a.href = dataUrl || ''
    a.download = 'screenshot.png'
    a.click()
    a.remove()
  }

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
          onCancel={handleCancel}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
