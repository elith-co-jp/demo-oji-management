"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Database, Brain, TrendingUp, Cpu, Users, GitBranch, Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react"

export function AIAnalysisScreen() {
  const [showSection1, setShowSection1] = useState(false)
  const [showSection2, setShowSection2] = useState(false)
  const [showSection3, setShowSection3] = useState(false)
  const [section1Complete, setSection1Complete] = useState(false)
  const [graphProgress, setGraphProgress] = useState(0)
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [dataPoints, setDataPoints] = useState(0)
  const [showOvershoot, setShowOvershoot] = useState(false)
  const [showOptimized, setShowOptimized] = useState(false)
  const [showMontage, setShowMontage] = useState(false)
  const [currentPlanNumber, setCurrentPlanNumber] = useState(2)
  const [montageComplete, setMontageComplete] = useState(false)
  const [finalPlanScore, setFinalPlanScore] = useState(0)

  useEffect(() => {
    // Section 1: Past data analysis (1 second)
    const timer1 = setTimeout(() => {
      setShowSection1(true)
      
      // Animate data points counter
      let counter = 0
      const interval = setInterval(() => {
        counter += 157
        if (counter >= 2847) {
          counter = 2847
          clearInterval(interval)
          setSection1Complete(true)
        }
        setDataPoints(counter)
      }, 50)
    }, 1000)

    // Section 2: Process dynamics simulation (3 seconds)
    const timer2 = setTimeout(() => {
      setShowSection2(true)
      
      // First show overshoot problem
      setTimeout(() => {
        setShowOvershoot(true)
        
        // Animate graph drawing for overshoot
        let progress = 0
        const graphInterval = setInterval(() => {
          progress += 3
          if (progress >= 100) {
            progress = 100
            clearInterval(graphInterval)
            
            // After overshoot is shown, start montage
            setTimeout(() => {
              setShowMontage(true)
              
              // High-speed montage animation
              let planNum = 2
              const montageInterval = setInterval(() => {
                planNum += Math.floor(Math.random() * 5) + 3
                if (planNum >= 128) {
                  clearInterval(montageInterval)
                  
                  // After montage, show final optimized plan
                  setTimeout(() => {
                    setMontageComplete(true)
                    setCurrentPlanNumber(129)
                    setFinalPlanScore(98)
                    setShowOptimized(true)
                    
                    // Animate the final graph
                    let optGraphProgress = 0
                    const optGraphInterval = setInterval(() => {
                      optGraphProgress += 3
                      if (optGraphProgress >= 100) {
                        optGraphProgress = 100
                        clearInterval(optGraphInterval)
                      }
                      setGraphProgress(optGraphProgress)
                    }, 30)
                  }, 500)
                }
                setCurrentPlanNumber(planNum)
              }, 50) // Very fast iteration
            }, 1500)
          }
          setGraphProgress(progress)
        }, 30)
      }, 500)
    }, 3000)

    // Section 3: Optimization (6 seconds)
    const timer3 = setTimeout(() => {
      setShowSection3(true)
      
      // Animate optimization progress
      let optProgress = 0
      const optInterval = setInterval(() => {
        optProgress += 2
        if (optProgress >= 100) {
          optProgress = 100
          clearInterval(optInterval)
        }
        setOptimizationProgress(optProgress)
      }, 40)
    }, 6000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <div className="h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-6 overflow-auto">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            AIエージェントが最適経路を探索中...
          </h1>
          <div className="flex justify-center items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse delay-300"></div>
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse delay-600"></div>
          </div>
        </div>

        {/* AI Agents Team Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800/50 rounded-full border border-neutral-700">
            <Users className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-neutral-300">3つの専門AIエージェントが協調分析中</span>
          </div>
        </div>

        {/* Main Content - 3 Sections */}
        <div className="space-y-6">
          {/* Section 1: Past Data Analysis */}
          <div className={`transition-all duration-1000 ${showSection1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card className="bg-neutral-800/80 border-neutral-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-white">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Database className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div>① 過去実績分析エージェント</div>
                    <div className="text-sm text-neutral-400 font-normal mt-1">The Historian - ベテラン現場リーダーAI</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-neutral-900/50 p-4 rounded-lg">
                      <div className="text-sm text-neutral-400 mb-2">分析状況</div>
                      <div className="text-2xl font-bold text-blue-400">
                        {section1Complete ? '分析完了' : '類似パターンを分析中...'}
                      </div>
                      <div className="text-sm text-neutral-500 mt-2">
                        {dataPoints.toLocaleString()} / 2,847 件のデータを検索
                      </div>
                    </div>
                    <Progress value={(dataPoints / 2847) * 100} className="h-2" />
                  </div>
                  
                  <div className="bg-neutral-900/50 p-4 rounded-lg">
                    <div className="text-sm text-neutral-400 mb-3">発見した最適候補</div>
                    <div className="space-y-2">
                      {section1Complete && (
                        <>
                          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-sm text-green-300 font-medium">最優良事例を発見</span>
                            </div>
                            <div className="text-xs text-neutral-400 mt-1">
                              2024/10/15 - ΔE: 7.2 (成功率 98%)
                            </div>
                            <div className="text-xs text-yellow-300 mt-2">
                              ※ただし、パルプ白色度が異なるため要調整
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 2: Process Dynamics Simulation - Enhanced */}
          <div className={`transition-all duration-1000 ${showSection2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card className="bg-neutral-800/80 border-neutral-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-white">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Cpu className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div>② プロセス動力学シミュレーション</div>
                    <div className="text-sm text-neutral-400 font-normal mt-1">The Physicist - 設計エンジニアAI</div>
                  </div>
                  {showOvershoot && !showOptimized && (
                    <div className="ml-auto px-3 py-1 bg-yellow-500/20 rounded-full">
                      <span className="text-xs text-yellow-300">問題検知中...</span>
                    </div>
                  )}
                  {showOptimized && (
                    <div className="ml-auto px-3 py-1 bg-green-500/20 rounded-full">
                      <span className="text-xs text-green-300">最適化完了</span>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  {/* Left: Initial Plan with Overshoot */}
                  <div className={`transition-all duration-500 ${showOvershoot ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="bg-neutral-900/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-neutral-300 mb-3 flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-400" />
                        ① 過去実績に基づく初回プラン
                      </h4>
                      <div className="h-48 relative">
                        <svg className="w-full h-full" viewBox="0 0 400 180">
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
                          <text x="38" y="61" className="text-xs fill-green-400" textAnchor="end">
                            目標
                          </text>

                          {/* Start line */}
                          <line x1="40" y1="140" x2="360" y2="140" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />
                          <text x="38" y="144" className="text-xs fill-orange-400" textAnchor="end">
                            開始
                          </text>

                          {showOvershoot && (
                            <>
                              {/* Animated path with overshoot */}
                              <path
                                d={`M 40 140 ${Array.from({ length: Math.floor(graphProgress) }, (_, i) => {
                                  const x = 40 + (i * 320) / 100
                                  const progress = i / 100
                                  let y
                                  if (progress < 0.4) {
                                    // Quick rise
                                    y = 140 - (progress / 0.4) * 100
                                  } else if (progress < 0.6) {
                                    // Overshoot
                                    y = 40 - ((progress - 0.4) / 0.2) * 15
                                  } else {
                                    // Oscillation
                                    y = 25 + Math.sin((progress - 0.6) * 10) * 10 * (1 - (progress - 0.6) / 0.4)
                                  }
                                  return `L ${x} ${y}`
                                }).join(' ')}`}
                                stroke="#ef4444"
                                strokeWidth="2"
                                fill="none"
                              />

                              {/* Overshoot indicator */}
                              {graphProgress > 60 && (
                                <g>
                                  <circle cx="200" cy="25" r="8" fill="#ef4444" opacity="0.8" className="animate-pulse" />
                                  <text x="200" y="10" className="text-xs fill-red-400" textAnchor="middle">
                                    オーバーシュート!
                                  </text>
                                </g>
                              )}
                            </>
                          )}

                          {/* Axes labels */}
                          <text x="200" y="175" className="text-xs fill-neutral-400" textAnchor="middle">
                            時間経過
                          </text>
                          <text x="20" y="100" className="text-xs fill-neutral-400" textAnchor="middle" transform="rotate(-90 20 100)">
                            b値
                          </text>
                        </svg>
                      </div>
                      
                      {showOvershoot && graphProgress > 60 && (
                        <div className="mt-3 p-2 bg-red-900/30 border border-red-500/30 rounded">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-xs text-red-300">
                              警告：現在の条件下ではオーバーシュートを検知
                            </span>
                          </div>
                          <div className="text-xs text-neutral-400 mt-1">
                            パルプ白色度の違いにより、過去の成功プランが通用しません
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Optimization Search and Final Plan */}
                  <div className={`transition-all duration-500 ${showMontage || showOptimized ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="bg-neutral-900/50 p-4 rounded-lg relative overflow-hidden">
                      <h4 className="text-sm font-medium text-neutral-300 mb-3 flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-green-400" />
                        ② 動力学モデルによる最適化プラン
                        {showMontage && !montageComplete && (
                          <span className="ml-auto text-xs text-yellow-400 font-mono animate-pulse">
                            探索中... プラン #{currentPlanNumber}
                          </span>
                        )}
                        {montageComplete && (
                          <span className="ml-auto text-xs text-green-400 font-mono">
                            探索プラン #{currentPlanNumber} (スコア: {finalPlanScore}点)
                          </span>
                        )}
                      </h4>
                      
                      {/* Montage Cards */}
                      {showMontage && !montageComplete && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center">
                          <div className="grid grid-cols-3 gap-2 p-4">
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className="bg-neutral-800/90 border border-neutral-600 rounded p-2 animate-pulse"
                                style={{
                                  animationDelay: `${i * 100}ms`,
                                  opacity: Math.random() > 0.3 ? 1 : 0
                                }}
                              >
                                <div className="text-xs text-neutral-400 mb-1">
                                  探索プラン #{currentPlanNumber - i * 3}
                                </div>
                                <div className="h-12 bg-neutral-700/50 rounded flex items-center justify-center">
                                  <div className="text-xs font-mono text-orange-400">
                                    スコア: {75 + Math.floor(Math.random() * 20)}点
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className={`h-48 relative ${showMontage && !montageComplete ? 'opacity-20' : 'opacity-100'}`}>
                        <svg className="w-full h-full" viewBox="0 0 400 180">
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
                          <text x="38" y="61" className="text-xs fill-green-400" textAnchor="end">
                            目標
                          </text>

                          {/* Start line */}
                          <line x1="40" y1="140" x2="360" y2="140" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />
                          <text x="38" y="144" className="text-xs fill-orange-400" textAnchor="end">
                            開始
                          </text>

                          {(showOptimized && montageComplete) && (
                            <>
                              {/* Animated smooth path */}
                              <path
                                d={`M 40 140 ${Array.from({ length: Math.floor(graphProgress) }, (_, i) => {
                                  const x = 40 + (i * 320) / 100
                                  const progress = i / 100
                                  // Smooth exponential approach to target
                                  const y = 140 - (140 - 57) * (1 - Math.exp(-4 * progress))
                                  return `L ${x} ${y}`
                                }).join(' ')}`}
                                stroke="#10b981"
                                strokeWidth="2"
                                fill="none"
                              />

                              {/* Optimization points */}
                              {graphProgress > 30 && (
                                <circle cx="140" cy="110" r="3" fill="#10b981" opacity="0.8" />
                              )}
                              {graphProgress > 60 && (
                                <circle cx="240" cy="75" r="3" fill="#10b981" opacity="0.8" />
                              )}
                              {graphProgress > 90 && (
                                <circle cx="340" cy="59" r="3" fill="#10b981" opacity="0.8" />
                              )}
                            </>
                          )}

                          {/* Axes labels */}
                          <text x="200" y="175" className="text-xs fill-neutral-400" textAnchor="middle">
                            時間経過
                          </text>
                          <text x="20" y="100" className="text-xs fill-neutral-400" textAnchor="middle" transform="rotate(-90 20 100)">
                            b値
                          </text>
                        </svg>
                      </div>
                      
                      {montageComplete && showOptimized && graphProgress > 90 && (
                        <div className="mt-3 p-2 bg-green-900/30 border border-green-500/30 rounded">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-green-300">
                              結論：オーバーシュートを回避する最適経路を発見
                            </span>
                          </div>
                          <div className="text-xs text-neutral-400 mt-1">
                            物理モデルが工場のクセを解析し、最短・最適ルートを導出
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Simulation Comparison Results */}
                {montageComplete && showOptimized && (
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    <div className="bg-neutral-900/50 p-3 rounded text-center">
                      <div className="text-xs text-neutral-400">安定時間</div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-red-400 line-through">45分</span>
                        <span className="text-sm">→</span>
                        <span className="text-lg font-bold text-green-400">28分</span>
                      </div>
                    </div>
                    <div className="bg-neutral-900/50 p-3 rounded text-center">
                      <div className="text-xs text-neutral-400">オーバーシュート</div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-red-400">3回</span>
                        <span className="text-sm">→</span>
                        <span className="text-lg font-bold text-green-400">0回</span>
                      </div>
                    </div>
                    <div className="bg-neutral-900/50 p-3 rounded text-center">
                      <div className="text-xs text-neutral-400">染料効率</div>
                      <div className="text-lg font-bold text-blue-400">+18%</div>
                    </div>
                    <div className="bg-neutral-900/50 p-3 rounded text-center">
                      <div className="text-xs text-neutral-400">成功確率</div>
                      <div className="text-lg font-bold text-purple-400">98.7%</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Section 3: Optimization */}
          <div className={`transition-all duration-1000 ${showSection3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card className="bg-neutral-800/80 border-neutral-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-white">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Brain className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <div>③ 計画最適化エージェント</div>
                    <div className="text-sm text-neutral-400 font-normal mt-1">The Planner - 司令塔AI</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-neutral-900/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-neutral-300">制御パターンの最適化</span>
                      <span className="text-sm font-mono text-orange-400">{optimizationProgress}%</span>
                    </div>
                    <Progress value={optimizationProgress} className="h-3 bg-neutral-700" />
                  </div>

                  {/* Optimization Steps */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className={`bg-neutral-900/50 p-3 rounded-lg transition-all ${optimizationProgress > 30 ? 'border border-green-500/50' : ''}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${optimizationProgress > 30 ? 'bg-green-400' : 'bg-neutral-600'}`}></div>
                        <span className="text-xs text-neutral-300">初期プラン取得</span>
                      </div>
                      <div className="text-xs text-neutral-500">
                        ベテランAIから優良事例を受領
                      </div>
                    </div>

                    <div className={`bg-neutral-900/50 p-3 rounded-lg transition-all ${optimizationProgress > 60 ? 'border border-green-500/50' : ''}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${optimizationProgress > 60 ? 'bg-green-400' : 'bg-neutral-600'}`}></div>
                        <span className="text-xs text-neutral-300">問題解決</span>
                      </div>
                      <div className="text-xs text-neutral-500">
                        147回の微調整でオーバーシュート回避
                      </div>
                    </div>

                    <div className={`bg-neutral-900/50 p-3 rounded-lg transition-all ${optimizationProgress >= 100 ? 'border border-green-500/50' : ''}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${optimizationProgress >= 100 ? 'bg-green-400' : 'bg-neutral-600'}`}></div>
                        <span className="text-xs text-neutral-300">最終検証</span>
                      </div>
                      <div className="text-xs text-neutral-500">
                        全制約を満たす最適プラン完成
                      </div>
                    </div>
                  </div>

                  {/* Final Result */}
                  {optimizationProgress >= 100 && (
                    <div className="bg-gradient-to-r from-orange-600/20 to-orange-500/20 p-4 rounded-lg border border-orange-500/30">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-orange-400" />
                        <div>
                          <div className="text-sm font-medium text-orange-300">最適化完了</div>
                          <div className="text-xs text-neutral-400 mt-1">
                            3つのAIエージェントの協調により、過去の成功事例を現在の条件に最適化しました
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}