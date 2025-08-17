"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Play, Pause, Activity, TrendingUp, AlertCircle } from "lucide-react"

interface ExecutionScreenProps {
  planData?: any
  optimalPath?: number[]
  stabilityTime?: number
}

interface ExtendedExecutionScreenProps extends ExecutionScreenProps {
  onComplete?: () => void
}

export function ExecutionScreen({ planData, optimalPath, stabilityTime = 28, onComplete }: ExtendedExecutionScreenProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [colorValues, setColorValues] = useState({ L: 85.2, a: -2.1, b: 12.8 })
  const [currentGraphData, setCurrentGraphData] = useState<number[]>([140])
  const [adjustments, setAdjustments] = useState<Array<{ 
    time: number
    tag: string
    action: string
    note: string
    oldValue?: string
  }>>([])

  const targetValues = planData?.targetValues || { L: 92.5, a: -1.8, b: 8.4 }
  const totalDuration = stabilityTime // Use the stability time from AI analysis

  // Generate random control tags
  const controlTags = [
    "YFS-001", "YFS-002", "YFS-005", "YFI-006", "YFI-009", "YFI-010",
    "YLI-012", "YP-012", "YP-013", "YP-014", "YP-015", "YP-016",
    "CT290003", "TM290009", "DYE-34", "DYE-3D", "DYE-3S"
  ]

  const controlActions = [
    { action: "SV", unit: "", min: 0.3, max: 0.9 },
    { action: "PV", unit: " L/M", min: 0.5, max: 4.0 },
    { action: "PV", unit: " %", min: 20, max: 95 },
    { action: "PH", unit: "", min: 300, max: 800 },
    { action: "AUT", unit: "", min: 0, max: 0 },
    { action: "MAN", unit: "", min: 0, max: 0 },
  ]

  const controlNotes = [
    "染料比率設定", "染料流量調整", "タンク液面調整", 
    "ポンプ自動化", "バルブ制御", "タイマー設定",
    "工程完了", "異常値回復", "手動介入"
  ]

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev + 0.1
        
        // Only add new point to existing graph data, don't regenerate entire path
        const progress = newTime / totalDuration
        const targetY = 57
        
        // Copy existing path
        const newPath = [...currentGraphData]
        
        // Add new point only if we've moved to a new time unit
        if (Math.floor(newTime) >= newPath.length) {
          const i = newPath.length
          const pointProgress = i / totalDuration
          let y
          
          if (pointProgress < 0.3) {
            // Early: some deviation
            const noise = (Math.random() - 0.5) * 15
            y = 140 - (140 - targetY) * (1 - Math.exp(-3 * pointProgress)) + noise
          } else if (pointProgress < 0.7) {
            // Middle: converging
            const noise = (Math.random() - 0.5) * 8
            y = 140 - (140 - targetY) * (1 - Math.exp(-3.5 * pointProgress)) + noise
          } else {
            // Late: stable near target
            const noise = (Math.random() - 0.5) * 3
            y = targetY + noise
          }
          
          newPath.push(Math.max(25, Math.min(140, y)))
        }
        
        setCurrentGraphData(newPath)

        // Simulate color changes over time
        setColorValues({
          L: 85.2 + (targetValues.L - 85.2) * progress,
          a: -2.1 + (targetValues.a - -2.1) * progress,
          b: 12.8 + (targetValues.b - 12.8) * progress,
        })

        // Generate random adjustments at certain intervals
        if (Math.random() < 0.01 && adjustments.length < 8) {
          const tag = controlTags[Math.floor(Math.random() * controlTags.length)]
          const actionType = controlActions[Math.floor(Math.random() * controlActions.length)]
          let value = ""
          let oldVal = ""
          
          if (actionType.action === "AUT" || actionType.action === "MAN") {
            value = actionType.action
            oldVal = actionType.action === "AUT" ? "MAN" : "AUT"
          } else {
            const val = (actionType.min + Math.random() * (actionType.max - actionType.min)).toFixed(actionType.unit ? 2 : 3)
            const old = (actionType.min + Math.random() * (actionType.max - actionType.min)).toFixed(actionType.unit ? 2 : 3)
            value = `${actionType.action} = ${val}${actionType.unit}`
            oldVal = `${old}${actionType.unit}`
          }
          
          setAdjustments((prev) => [
            ...prev,
            {
              time: newTime,
              tag: tag,
              action: value,
              note: controlNotes[Math.floor(Math.random() * controlNotes.length)],
              oldValue: oldVal,
            },
          ])
          
          // Add slight perturbation only to the last point when adjustment happens
          if (newPath.length > 0) {
            const lastIdx = newPath.length - 1
            newPath[lastIdx] += (Math.random() - 0.5) * 5
            newPath[lastIdx] = Math.max(25, Math.min(140, newPath[lastIdx]))
          }
        }

        if (newTime >= totalDuration) {
          if (onComplete) {
            setTimeout(() => {
              onComplete()
            }, 3000)
          }
          return totalDuration
        }
        return newTime
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning, adjustments.length, currentGraphData, targetValues, totalDuration, controlTags, controlActions, controlNotes])

  const labToRgb = (L: number, a: number, b: number) => {
    const r = Math.max(0, Math.min(255, L * 2.55 + a * 1.5))
    const g = Math.max(0, Math.min(255, L * 2.55 - a * 0.5 - b * 0.5))
    const blue = Math.max(0, Math.min(255, L * 2.55 - b * 2))
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(blue)})`
  }

  return (
    <div className="h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-6 overflow-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center items-center gap-3 mb-3">
          <Activity className="w-5 h-5 text-green-400 animate-pulse" />
          <span className="text-sm text-green-400 font-medium">実行中</span>
        </div>
        <h1 className="text-3xl font-bold text-white">リアルタイム実行監視</h1>
        <h2 className="text-lg text-orange-400 font-medium mt-2">STEP 4: プロセス監視と制御</h2>
      </div>

      {/* Control Panel */}
      <div className="flex justify-center mb-6">
        <Card className="bg-neutral-800/80 border-neutral-700">
          <CardContent className="py-3 px-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsRunning(!isRunning)}
                size="sm"
                className={isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
              >
                {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isRunning ? "一時停止" : "開始"}
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-400">経過時間:</span>
                <span className="text-lg font-mono text-white">{currentTime.toFixed(1)} / {totalDuration} 分</span>
              </div>
              <Progress value={(currentTime / totalDuration) * 100} className="w-64" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Real-time Color Values */}
        <div className="col-span-3">
          <Card className="bg-neutral-800/90 border-neutral-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white">リアルタイム色相値</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-neutral-900/50 p-4 rounded-lg">
                <div
                  className="w-full h-32 rounded-lg border-2 border-neutral-600 mb-3"
                  style={{ backgroundColor: labToRgb(colorValues.L, colorValues.a, colorValues.b) }}
                ></div>
                <p className="text-xs text-neutral-400 text-center font-mono">
                  現在値
                </p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-neutral-400">L値</span>
                    <span className="text-xs font-mono text-white">{colorValues.L.toFixed(1)}</span>
                  </div>
                  <Progress value={(colorValues.L / 100) * 100} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-neutral-400">a値</span>
                    <span className="text-xs font-mono text-white">{colorValues.a.toFixed(1)}</span>
                  </div>
                  <Progress value={(colorValues.a + 50) * 2} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-neutral-400">b値</span>
                    <span className="text-xs font-mono text-white">{colorValues.b.toFixed(1)}</span>
                  </div>
                  <Progress value={(colorValues.b + 50) * 2} className="h-1.5" />
                </div>
              </div>

              <div className="bg-neutral-900/50 p-3 rounded-lg">
                <div className="text-xs text-neutral-400 mb-2">目標値との差</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-neutral-500">ΔL:</span>
                    <span className="text-xs font-mono text-orange-400">
                      {(targetValues.L - colorValues.L).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-neutral-500">Δa:</span>
                    <span className="text-xs font-mono text-orange-400">
                      {(targetValues.a - colorValues.a).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-neutral-500">Δb:</span>
                    <span className="text-xs font-mono text-orange-400">
                      {(targetValues.b - colorValues.b).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center - Real-time Graph */}
        <div className="col-span-6">
          <Card className="bg-neutral-800/90 border-neutral-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                リアルタイム色変遷
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-neutral-900/50 rounded-lg p-4">
                <svg width="100%" height="350" viewBox="0 0 400 200" className="text-white">
                  {/* Grid */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line
                      key={i}
                      x1={40}
                      y1={160 - i * 35}
                      x2={360}
                      y2={160 - i * 35}
                      stroke="#525252"
                      strokeWidth="0.5"
                      strokeDasharray="2,2"
                    />
                  ))}
                  
                  {/* Target zone */}
                  <rect x="40" y="50" width="320" height="15" fill="#10b981" opacity="0.2" />
                  <line x1="40" y1="57" x2="360" y2="57" stroke="#10b981" strokeWidth="1" strokeDasharray="5,5" />
                  
                  {/* Expected path (faded) */}
                  {optimalPath && optimalPath.length > 0 && (
                    <path
                      d={`M 40 140 ${optimalPath.map((y, i) => `L ${40 + i * 16} ${y}`).join(' ')}`}
                      stroke="#10b981"
                      strokeWidth="1"
                      fill="none"
                      opacity="0.3"
                    />
                  )}
                  
                  {/* Current path (real-time) */}
                  {currentGraphData.length > 0 && (
                    <path
                      d={`M 40 140 ${currentGraphData.map((y, i) => `L ${40 + (i * 320) / totalDuration} ${y}`).join(' ')}`}
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      fill="none"
                    />
                  )}
                  
                  {/* Current position marker */}
                  {currentGraphData.length > 0 && (
                    <circle
                      cx={40 + (currentTime * 320) / totalDuration}
                      cy={currentGraphData[currentGraphData.length - 1]}
                      r="4"
                      fill="#3b82f6"
                      className="animate-pulse"
                    />
                  )}
                  
                  {/* Adjustment markers */}
                  {adjustments.map((adj, idx) => (
                    <g key={idx}>
                      <line
                        x1={40 + (adj.time * 320) / totalDuration}
                        y1={20}
                        x2={40 + (adj.time * 320) / totalDuration}
                        y2={160}
                        stroke="#f59e0b"
                        strokeWidth="0.5"
                        strokeDasharray="2,2"
                        opacity="0.5"
                      />
                      <circle
                        cx={40 + (adj.time * 320) / totalDuration}
                        cy={20}
                        r="3"
                        fill="#f59e0b"
                      />
                    </g>
                  ))}
                  
                  {/* Labels */}
                  <text x="38" y="61" className="text-xs fill-green-400" textAnchor="end">
                    目標
                  </text>
                  <text x="38" y="144" className="text-xs fill-orange-400" textAnchor="end">
                    開始
                  </text>
                  <text x="200" y="190" className="text-xs fill-neutral-400" textAnchor="middle">
                    時間経過 (分)
                  </text>
                  
                  {/* Time axis */}
                  {[0, 5, 10, 15, 20, 25].map((time, i) => (
                    <text key={i} x={40 + i * 64} y="175" fill="#a3a3a3" fontSize="9" textAnchor="middle">
                      {time}
                    </text>
                  ))}
                </svg>
              </div>
              
              {/* Status indicators */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-neutral-900/50 p-2 rounded text-center">
                  <div className="text-xs text-neutral-400">安定到達時間</div>
                  <div className="text-lg font-bold text-green-400">{stabilityTime}分</div>
                </div>
                <div className="bg-neutral-900/50 p-2 rounded text-center">
                  <div className="text-xs text-neutral-400">調整回数</div>
                  <div className="text-lg font-bold text-orange-400">{adjustments.length}</div>
                </div>
                <div className="bg-neutral-900/50 p-2 rounded text-center">
                  <div className="text-xs text-neutral-400">進捗率</div>
                  <div className="text-lg font-bold text-blue-400">
                    {Math.round((currentTime / totalDuration) * 100)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Adjustment History */}
        <div className="col-span-3">
          <Card className="bg-neutral-800/90 border-neutral-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-400" />
                調整履歴
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {adjustments.length === 0 ? (
                  <div className="text-xs text-neutral-500 text-center py-4">
                    調整待機中...
                  </div>
                ) : (
                  adjustments.map((adj, index) => (
                    <div key={index} className="bg-neutral-900/50 p-2 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-neutral-500 font-mono">
                          {adj.time.toFixed(1)}分
                        </span>
                        <span className="text-xs font-bold text-orange-400">{adj.tag}</span>
                      </div>
                      <div className="text-xs text-white font-mono">{adj.action}</div>
                      {adj.oldValue && (
                        <div className="text-xs text-neutral-500 mt-1">
                          old = {adj.oldValue}
                        </div>
                      )}
                      <div className="text-xs text-neutral-400 mt-1">{adj.note}</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}