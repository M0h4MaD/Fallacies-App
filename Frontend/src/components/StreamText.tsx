import { useEffect, useState } from 'react'

export default function StreamText({ text }: { text: string }) {
  const [shown, setShown] = useState('')

  useEffect(() => {
    setShown('')
    const words = text.split(' ')
    let i = 0
    const interval = setInterval(() => {
      i++
      setShown(words.slice(0, i).join(' '))
      if (i >= words.length) clearInterval(interval)
    }, 35)
    return () => clearInterval(interval)
  }, [text])

  return <>{shown}</>
}
