import type { SnipProps } from '@/components/snip/type'
import { useEffect, useRef, useState } from 'react'
import { selectOptions } from '@/components/dialog/data'

function handleSnip(
  ctx: CanvasRenderingContext2D,
  startP: { x: number, y: number },
  endP: { x: number, y: number },
) {
  const imageData = ctx.getImageData(
    startP.x,
    startP.y,
    endP.x - startP.x,
    endP.y - startP.y,
  )
  const newCanvas = document.createElement('canvas')
  newCanvas.width = endP.x - startP.x
  newCanvas.height = endP.y - startP.y
  newCanvas.getContext('2d')!.putImageData(imageData, 0, 0)
  return newCanvas.toDataURL('image/png')
}

function Snip({ img, SnipDatas, drawColor = 'blue', onChange }: SnipProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [isDrawing, setIsDrawing] = useState(false)
  const [startP, setStartP] = useState({
    x: 0,
    y: 0,
  })
  const [endP, setEndP] = useState({
    x: 0,
    y: 0,
  })
  const imageRef = useRef<HTMLImageElement | null>(null)

  // 是否显示
  const [isShowOption, setIsShowOption] = useState(false)
  const [selectedOption, setSelectedOption] = useState(selectOptions[0].value)

  const drawBackground = () => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    canvas.width = imageRef.current!.width
    canvas.height = imageRef.current!.height
    ctx.drawImage(imageRef.current!, 0, 0)
  }

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    const image = new Image()
    image.src = img
    image.onload = () => {
      imageRef.current = image
      drawBackground()
    }

    for (const snipData of SnipDatas) {
      const {
        startP,
        endP,
        class: selectedOption,
        snipImage,
        source,
      } = snipData

      if (source !== img)
        continue

      const image = new Image()
      image.src = snipImage
      image.onload = () => {
        ctx.strokeStyle = drawColor
        ctx.beginPath()
        ctx.rect(startP.x, startP.y, endP.x - startP.x, endP.y - startP.y)
        ctx.stroke()
        ctx.fillStyle = drawColor
        ctx.font = '14px Arial'
        ctx.fillText(
          selectedOption,
          Math.min(startP.x, endP.x),
          Math.min(startP.y, endP.y) - 10,
        )
      }
    }
  }, [img, SnipDatas, drawColor])

  const drawSquare = () => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.strokeStyle = drawColor
    ctx.beginPath()
    ctx.rect(startP.x, startP.y, endP.x - startP.x, endP.y - startP.y)
    ctx.stroke()
  }

  const drawClass = () => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = drawColor
    ctx.font = '14px Arial'
    ctx.fillText(
      selectedOption,
      Math.min(startP.x, endP.x),
      Math.min(startP.y, endP.y) - 10,
    )
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent
    setIsDrawing(true)
    setStartP({ x: offsetX, y: offsetY })
    setEndP({ x: offsetX, y: offsetY })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing)
      return

    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const { offsetX, offsetY } = e.nativeEvent

    setEndP({ x: offsetX, y: offsetY })

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBackground()
    drawSquare()
  }

  const handleMouseUp = () => {
    setIsDrawing(false)

    // 阈值
    if (Math.abs(startP.x - endP.x) < 5 || Math.abs(startP.y - endP.y) < 5) {
      console.log('do not draw box, too small area.')
      return
    }
    setIsShowOption(true)
    drawClass()
  }

  const handleAddNewBox = () => {
    const ctx = canvasRef.current!.getContext('2d')!
    // 截取图片
    const snipImage = handleSnip(ctx, startP, endP)

    const data = {
      source: img,
      startP,
      endP,
      class: selectedOption,
      snipImage,
    }

    for (const snipData of SnipDatas) {
      if (snipData.snipImage === data.snipImage) {
        return
      }
    }

    onChange(data)
  }

  const handleChange = (e: any) => {
    setSelectedOption(e.target.value)
    drawBackground()
    drawSquare()
    drawClass()
  }

  return (
    <div>
      {isShowOption && (
        <div className="mb-10">
          <select
            className="block w-full appearance-none rounded border border-gray-300 bg-white px-4 py-2 pr-8 hover:border-gray-500 focus:border-blue-500 focus:outline-none"
            value={selectedOption}
            onChange={handleChange}
          >
            <option disabled hidden value="">
              Choose an option
            </option>
            {selectOptions.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <div className="mt-2 flex items-center justify-between">
            <button
              className="w-1/2 rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 hover:bg-gray-100 focus:border-blue-500 focus:outline-none"
              type="button"
              onClick={handleAddNewBox}
            >
              add new mark
            </button>
            <button
              className="w-1/2 rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 hover:bg-gray-100 focus:border-blue-500 focus:outline-none"
              type="button"
              onClick={handleAddNewBox}
            >
              add new box
            </button>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  )
};

export default Snip
