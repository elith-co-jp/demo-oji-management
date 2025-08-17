"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, AlertTriangle, CheckCircle2, Activity } from "lucide-react"

interface ColorData {
  time: number
  L: number
  a: number
  b: number
}

interface Adjustment {
  time: number
  parameter: 'L' | 'a' | 'b'
  sequenceCode: string
  description: string
  oldValue: string
  newValue: string
  createdAt: number
}

export function ColorMaintenanceScreen() {
  const [currentTime, setCurrentTime] = useState(0)
  const [colorData, setColorData] = useState<ColorData[]>([])
  const [adjustments, setAdjustments] = useState<Adjustment[]>([])
  const [currentPhase, setCurrentPhase] = useState<{L: string, a: string, b: string}>({
    L: 'normal', a: 'normal', b: 'normal'
  })
  const timeRef = useRef(0)
  const phaseStartRef = useRef<{L: number, a: number, b: number}>({L: 0, a: 0, b: 0})
  const deviationStartRef = useRef<{L?: number, a?: number, b?: number}>({})
  const deviationDirectionRef = useRef<{L?: number, a?: number, b?: number}>({})
  const boundaryWaitRef = useRef<{L?: number, a?: number, b?: number}>({})
  const phaseTransitionRef = useRef<{L?: boolean, a?: boolean, b?: boolean}>({})
  
  // Target values and ranges
  const targets = {
    L: { value: 92.5, min: 91.5, max: 93.5, range: 1.0 },
    a: { value: -1.8, min: -2.3, max: -1.3, range: 0.5 },
    b: { value: 8.4, min: 7.9, max: 8.9, range: 0.5 }
  }

  // Initialize with stable data
  useEffect(() => {
    const initialData: ColorData[] = []
    for (let i = 0; i < 60; i++) {
      initialData.push({
        time: i,
        L: targets.L.value,
        a: targets.a.value,
        b: targets.b.value
      })
    }
    setColorData(initialData)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(prev => prev + 0.1)
      timeRef.current += 1
      
      setColorData(prev => {
        const newData = [...prev]
        const latestTime = timeRef.current
        
        // Get last values or defaults
        const lastData = newData.length > 0 ? newData[newData.length - 1] : {
          L: targets.L.value,
          a: targets.a.value,
          b: targets.b.value
        }
        
        let newL = lastData.L
        let newA = lastData.a
        let newB = lastData.b
        
        // Process each parameter independently
        const parameters: ('L' | 'a' | 'b')[] = ['L', 'a', 'b']
        
        parameters.forEach(param => {
          const target = targets[param]
          const phase = currentPhase[param]
          const phaseStart = phaseStartRef.current[param]
          const elapsed = latestTime - phaseStart
          
          // Get the last value for this parameter
          const lastValue = param === 'L' ? lastData.L : param === 'a' ? lastData.a : lastData.b
          
          // Debug logging
          if (elapsed === 0 || elapsed % 50 === 0) {
            console.log(`${param}: phase=${phase}, elapsed=${elapsed}, value=${lastValue}`)
          }
          
          switch(phase) {
            case 'normal':
              // Clear transition flag when entering normal phase
              phaseTransitionRef.current[param] = false
              
              // Normal operation - very small variations around target
              const baseValue = target.value
              const tinyNoise = (Math.random() - 0.5) * 0.005 // Much smaller noise
              const normalValue = baseValue + tinyNoise
              
              if (param === 'L') newL = normalValue
              else if (param === 'a') newA = normalValue
              else if (param === 'b') newB = normalValue
              
              // Random chance to start deviation (lower frequency)
              // Different probability for each parameter for variation
              const deviationChance = param === 'L' ? 0.003 : param === 'a' ? 0.004 : 0.002
              if (Math.random() < deviationChance) {
                console.log(`Starting deviation for ${param} from value ${normalValue}`)
                setCurrentPhase(prev => ({...prev, [param]: 'deviating'}))
                phaseStartRef.current[param] = latestTime
                // Store the current normal value (with tiny noise) to ensure continuity
                deviationStartRef.current[param] = normalValue
                // Decide direction once and stick to it
                deviationDirectionRef.current[param] = Math.random() > 0.5 ? 1 : -1
              }
              break
              
            case 'deviating':
              // Deviation phase - smoothly move toward 50% of range
              const deviationDuration = 60 // 6 seconds for smooth movement to 50%
              
              if (elapsed < deviationDuration) {
                const progress = elapsed / deviationDuration
                // Very smooth linear movement
                const smoothProgress = progress
                
                // Use pre-decided direction
                const direction = deviationDirectionRef.current[param] || 1
                const startValue = deviationStartRef.current[param] || target.value
                
                // Move from start to 50% of range
                const targetPosition = target.value + (direction * target.range * 0.5)
                const currentValue = startValue + (targetPosition - startValue) * smoothProgress
                
                // No noise to keep line perfectly smooth
                if (param === 'L') newL = currentValue
                else if (param === 'a') newA = currentValue
                else if (param === 'b') newB = currentValue
              } else {
                // Reached threshold - continue at threshold value and start adjusting
                const direction = deviationDirectionRef.current[param] || 1
                const thresholdValue = target.value + (direction * target.range * 0.5)
                if (param === 'L') newL = thresholdValue
                else if (param === 'a') newA = thresholdValue
                else if (param === 'b') newB = thresholdValue
                
                // Immediately trigger AI adjustment at 50% threshold
                console.log(`Triggering AI adjustment for ${param} at 50% threshold`)
                setCurrentPhase(prev => ({...prev, [param]: 'adjusting'}))
                phaseStartRef.current[param] = latestTime
                
                // Store the threshold value as the starting point for adjustment
                // This ensures smooth transition without jumps
                deviationStartRef.current[param] = thresholdValue
                
                // Add adjustment record with control sequence format
                const sequences = {
                  L: [
                    { code: 'YFS-001', desc: 'No.1染料比率設定', oldVal: '0.821', newVal: '0.850' },
                    { code: 'YFS-003', desc: 'No.3染料比率設定', oldVal: '0.712', newVal: '0.745' },
                    { code: 'YFI-006', desc: 'No.1染料流量 HI', oldVal: '2.85 L/M', newVal: '3.37 L/M' },
                    { code: 'YLI-012', desc: '染料タンク液面 Recover', oldVal: '65.0 %', newVal: '78.0 %' }
                  ],
                  a: [
                    { code: 'YFS-005', desc: 'No.5染料比率設定', oldVal: '0.385', newVal: '0.414' },
                    { code: 'YP-012', desc: 'No.1染料添加P 自動化', oldVal: 'MAN', newVal: 'AUT' },
                    { code: 'YFI-010', desc: 'No.5染料流量調整', oldVal: '1.85 L/M', newVal: '2.17 L/M' }
                  ],
                  b: [
                    { code: 'CT290003', desc: 'No.3染料工程完了', oldVal: '4', newVal: '0' },
                    { code: 'TM290009', desc: '染料LO遅延タイマー', oldVal: '700', newVal: '500' },
                    { code: 'YFS-001', desc: '最終調整', oldVal: '0.850', newVal: '0.821' }
                  ]
                }
                
                const sequenceList = sequences[param]
                const randomSequence = sequenceList[Math.floor(Math.random() * sequenceList.length)]
                
                setAdjustments(prev => [...prev, {
                  time: latestTime,
                  parameter: param,
                  sequenceCode: randomSequence.code,
                  description: randomSequence.desc,
                  oldValue: randomSequence.oldVal,
                  newValue: randomSequence.newVal,
                  createdAt: latestTime
                }])
                
                // Clear transition flag
                phaseTransitionRef.current[param] = false
              }
              break
              
            case 'at_threshold':
              // This phase is no longer used - immediately transition to adjusting
              // Kept for backward compatibility
              const direction = deviationDirectionRef.current[param] || 1
              const thresholdValue = target.value + (direction * target.range * 0.5)
              if (param === 'L') newL = thresholdValue
              else if (param === 'a') newA = thresholdValue
              else if (param === 'b') newB = thresholdValue
              
              // Immediately move to adjusting
              setCurrentPhase(prev => ({...prev, [param]: 'adjusting'}))
              phaseStartRef.current[param] = latestTime
              break
              
            case 'at_boundary':
              // This case is no longer used, but kept for compatibility
              break
              
            case 'adjusting':
              // AI adjustment - smooth return to target from 50% threshold
              const adjustDuration = 50 // 5 seconds for return from 50%
              
              // Use the stored starting value (set when entering adjusting phase from deviating)
              // This ensures continuity and prevents jumps
              const adjustStartValue = deviationStartRef.current[param] || lastValue
              
              if (elapsed < adjustDuration) {
                const progress = elapsed / adjustDuration
                // Perfectly linear return
                const smoothReturn = progress
                
                // Smooth return to target from current position
                const targetValue = target.value
                const adjustedValue = adjustStartValue + (targetValue - adjustStartValue) * smoothReturn
                
                // No noise - perfectly smooth
                if (param === 'L') newL = adjustedValue
                else if (param === 'a') newA = adjustedValue
                else if (param === 'b') newB = adjustedValue
              } else {
                // Add tiny noise to match normal phase
                const tinyNoise = (Math.random() - 0.5) * 0.005
                const finalValue = target.value + tinyNoise
                
                if (param === 'L') newL = finalValue
                else if (param === 'a') newA = finalValue
                else if (param === 'b') newB = finalValue
                
                if (!phaseTransitionRef.current[param]) {
                  // Mark transition to prevent double processing
                  phaseTransitionRef.current[param] = true
                  
                  // Return to normal
                  setCurrentPhase(prev => ({...prev, [param]: 'normal'}))
                  phaseStartRef.current[param] = latestTime
                  
                  // Clear deviation direction, start value and transition flag
                  deviationDirectionRef.current[param] = undefined
                  deviationStartRef.current[param] = undefined
                  boundaryWaitRef.current[param] = undefined
                }
              }
              break
          }
        })
        
        // Add new data point
        newData.push({
          time: latestTime,
          L: newL,
          a: newA,
          b: newB
        })
        
        // Keep only last 30 seconds of data
        if (newData.length > 300) {
          return newData.slice(-300)
        }
        
        return newData
      })
      
      // Clean up old adjustments
      setAdjustments(prev => prev.filter(adj => timeRef.current - adj.createdAt < 300))
    }, 100)

    return () => clearInterval(interval)
  }, [currentPhase])

  const renderGraph = (
    parameter: 'L' | 'a' | 'b',
    data: number[],
    target: typeof targets.L,
    color: string,
    label: string
  ) => {
    const svgHeight = 200
    const svgWidth = 800
    const padding = 40
    const graphWidth = svgWidth - padding * 2
    const graphHeight = svgHeight - padding * 2
    
    // Scale to show full range
    const range = target.range * 1.5
    const minValue = target.value - range
    const maxValue = target.value + range
    
    const scaleY = (value: number) => {
      const normalized = (value - minValue) / (maxValue - minValue)
      return padding + graphHeight * (1 - normalized)
    }
    
    const scaleX = (index: number) => {
      return padding + (index / Math.max(data.length - 1, 1)) * graphWidth
    }
    
    const phase = currentPhase[parameter]
    const isWarning = phase === 'deviating'
    const isAdjusting = phase === 'adjusting'
    
    return (
      <Card className="bg-neutral-800/90 border-neutral-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              {isWarning && (
                <AlertTriangle className="w-5 h-5 text-yellow-500 animate-pulse" />
              )}
              {isAdjusting && (
                <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
              )}
              {label}値モニタリング
            </span>
            <span className="text-2xl font-mono font-bold" style={{ color }}>
              {data.length > 0 ? data[data.length - 1].toFixed(2) : target.value.toFixed(2)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-neutral-900/50 rounded-lg p-4">
            <svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="text-white">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1={padding}
                  y1={padding + (i * graphHeight) / 4}
                  x2={svgWidth - padding}
                  y2={padding + (i * graphHeight) / 4}
                  stroke="#525252"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              ))}
              
              {/* Target range */}
              <rect
                x={padding}
                y={scaleY(target.max)}
                width={graphWidth}
                height={scaleY(target.min) - scaleY(target.max)}
                fill="#10b981"
                opacity="0.1"
              />
              
              {/* Target line */}
              <line
                x1={padding}
                y1={scaleY(target.value)}
                x2={svgWidth - padding}
                y2={scaleY(target.value)}
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="5,5"
              />
              
              {/* Boundary lines */}
              <line
                x1={padding}
                y1={scaleY(target.min)}
                x2={svgWidth - padding}
                y2={scaleY(target.min)}
                stroke="#ef4444"
                strokeWidth="2"
                opacity="0.6"
              />
              <line
                x1={padding}
                y1={scaleY(target.max)}
                x2={svgWidth - padding}
                y2={scaleY(target.max)}
                stroke="#ef4444"
                strokeWidth="2"
                opacity="0.6"
              />
              
              {/* Data line */}
              {data.length > 1 && (
                <path
                  d={`M ${scaleX(0)} ${scaleY(data[0])} ${data.slice(1).map((value, i) => 
                    `L ${scaleX(i + 1)} ${scaleY(value)}`
                  ).join(' ')}`}
                  stroke={color}
                  strokeWidth="2.5"
                  fill="none"
                />
              )}
              
              {/* Current value indicator */}
              {data.length > 0 && (
                <circle
                  cx={scaleX(data.length - 1)}
                  cy={scaleY(data[data.length - 1])}
                  r="5"
                  fill={color}
                  className={isWarning || isAdjusting ? "animate-pulse" : ""}
                />
              )}
              
              {/* AI adjustment markers */}
              {adjustments.filter(adj => adj.parameter === parameter).map((adj, idx) => {
                const adjustmentAge = timeRef.current - adj.createdAt
                const xPosition = data.length - adjustmentAge - 1
                
                if (xPosition >= 0 && xPosition < data.length) {
                  const xPos = scaleX(xPosition)
                  return (
                    <g key={`${adj.createdAt}-${idx}`}>
                      <line
                        x1={xPos}
                        y1={padding}
                        x2={xPos}
                        y2={svgHeight - padding}
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeDasharray="6,3"
                        opacity="0.8"
                      />
                      <circle
                        cx={xPos}
                        cy={padding - 10}
                        r="10"
                        fill="#3b82f6"
                        className="animate-pulse"
                      />
                      <text
                        x={xPos}
                        y={padding - 6}
                        className="text-xs fill-white"
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        AI
                      </text>
                    </g>
                  )
                }
                return null
              })}
              
              {/* Y-axis labels */}
              <text x={padding - 5} y={scaleY(target.max)} className="text-sm fill-red-400 font-bold" textAnchor="end">
                {target.max.toFixed(1)}
              </text>
              <text x={padding - 5} y={scaleY(target.value)} className="text-sm fill-green-400 font-bold" textAnchor="end">
                {target.value.toFixed(1)}
              </text>
              <text x={padding - 5} y={scaleY(target.min)} className="text-sm fill-red-400 font-bold" textAnchor="end">
                {target.min.toFixed(1)}
              </text>
              
              {/* X-axis label */}
              <text x={svgWidth / 2} y={svgHeight - 5} className="text-xs fill-neutral-400" textAnchor="middle">
                時間 (過去30秒)
              </text>
            </svg>
          </div>
          
          {/* Status info */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-neutral-900/50 p-2 rounded text-center">
              <div className="text-xs text-neutral-400">目標値</div>
              <div className="text-lg font-bold text-green-400">{target.value.toFixed(2)}</div>
            </div>
            <div className="bg-neutral-900/50 p-2 rounded text-center">
              <div className="text-xs text-neutral-400">許容範囲</div>
              <div className="text-lg font-bold text-neutral-300">
                {target.min.toFixed(1)} ~ {target.max.toFixed(1)}
              </div>
            </div>
            <div className="bg-neutral-900/50 p-2 rounded text-center">
              <div className="text-xs text-neutral-400">状態</div>
              <div className="text-lg font-bold">
                {phase === 'deviating' ? (
                  <span className="text-yellow-400 flex items-center gap-1 justify-center">
                    <AlertTriangle className="w-3 h-3" />
                    警告
                  </span>
                ) : phase === 'adjusting' ? (
                  <span className="text-blue-400 flex items-center gap-1 justify-center">
                    <Activity className="w-3 h-3" />
                    調整中
                  </span>
                ) : (
                  <span className="text-green-400 flex items-center gap-1 justify-center">
                    <CheckCircle2 className="w-3 h-3" />
                    正常
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-6 overflow-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center items-center gap-3 mb-3">
          <Eye className="w-5 h-5 text-blue-400" />
          <span className="text-sm text-blue-400 font-medium">色相維持システム</span>
        </div>
        <h1 className="text-3xl font-bold text-white">リアルタイム色相維持監視</h1>
        <h2 className="text-lg text-orange-400 font-medium mt-2">LAB値の自動制御とAI調整</h2>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Graphs Column */}
        <div className="col-span-9 space-y-6">
          {renderGraph('L', colorData.map(d => d.L), targets.L, '#3b82f6', 'L')}
          {renderGraph('a', colorData.map(d => d.a), targets.a, '#ef4444', 'a')}
          {renderGraph('b', colorData.map(d => d.b), targets.b, '#f59e0b', 'b')}
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3">
          <Card className="bg-neutral-800/90 border-neutral-700 sticky top-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-blue-400" />
                制御シーケンス
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {adjustments.length === 0 ? (
                  <div className="text-xs text-neutral-500 text-center py-4">
                    調整履歴なし
                  </div>
                ) : (
                  adjustments.slice(-10).reverse().map((adj, index) => {
                    const currentMinute = Math.floor(adj.time / 10)
                    const currentSecond = Math.floor(adj.time % 10) * 10
                    const timeDisplay = `${String(currentMinute).padStart(2, '0')}:${String(currentSecond).padStart(2, '0')}`
                    
                    return (
                      <div key={index} className="bg-neutral-900/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-neutral-400">{timeDisplay}</span>
                        </div>
                        <div className="text-xs font-bold text-blue-400 mb-1">
                          {adj.sequenceCode}
                        </div>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-neutral-400">SV =</span>
                            <span className="font-mono text-green-400">{adj.newValue}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">old =</span>
                            <span className="font-mono text-orange-400">{adj.oldValue}</span>
                          </div>
                          <div className="text-xs text-white mt-1">
                            {adj.description}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
              
              {/* Debug Info */}
              <div className="mt-4 pt-4 border-t border-neutral-700">
                <div className="text-xs text-neutral-400 mb-2">現在の状態</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>L:</span>
                    <span className={currentPhase.L === 'normal' ? 'text-green-400' : 'text-yellow-400'}>
                      {currentPhase.L}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>a:</span>
                    <span className={currentPhase.a === 'normal' ? 'text-green-400' : 'text-yellow-400'}>
                      {currentPhase.a}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>b:</span>
                    <span className={currentPhase.b === 'normal' ? 'text-green-400' : 'text-yellow-400'}>
                      {currentPhase.b}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}