import html2canvas from 'html2canvas'
import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  function click() {
    console.log(html2canvas)
    const container = document.querySelector('#container')!
    html2canvas(container).then((canvas) => {
      console.log(canvas)

      const du = canvas.toDataURL('image/png')
      console.log(du)

      const img = document.createElement('img')
      img.onload = () => {
        document.body.append(img)
      }
      img.src = du
    })
  }

  return (
    <div className="h-[1000px] w-full bg-red-400" id="container">
      <button type="button" onClick={click}>
        click me
      </button>
      111
    </div>
  )
}
