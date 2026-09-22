// frontend/src/components/CountUp.tsx (ملف جديد)
import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function CountUp({ value, className }: { value: number; className?: string }) {
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { stiffness: 90, damping: 22 })
  const rounded = useTransform(spring, (v) => Math.round(v))
  const [display, setDisplay] = useState(0)

  useEffect(() => { motionVal.set(value) }, [value, motionVal])
  useEffect(() => rounded.on('change', setDisplay), [rounded])

  return <motion.span className={className}>{display}</motion.span>
}