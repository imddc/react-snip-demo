interface ToolBoxProps {
  position: {
    x: number
    y: number
  }
  onSave?: () => void
  onCancel?: () => void
}

function ToolBox({ onSave, onCancel, position }: ToolBoxProps) {
  return (
    <div
      className="absolute left-0 top-0 z-50 space-x-1 rounded-md bg-sky-500 p-1 text-white shadow-md"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <button className="rounded-md p-1 hover:bg-sky-600" type="button" onClick={onSave}>
        save
      </button>
      <button className="rounded-md p-1 hover:bg-sky-600" type="button" onClick={onCancel}>
        cancel
      </button>
    </div>
  )
}

export default ToolBox
