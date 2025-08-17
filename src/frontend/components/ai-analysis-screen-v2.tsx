"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Database, Brain, TrendingUp, Cpu, Users, GitBranch, Sparkles, AlertTriangle, CheckCircle2, Activity, Target, Zap } from "lucide-react"

interface AIAnalysisScreenV2Props {
  planData?: {
    pulpWhiteness: number
    targetL: number
    targetA: number
    targetB: number
  }
  onAnalysisComplete?: (optimalPath: number[], stabilityTime: number) => void
}

export function AIAnalysisScreenV2({ planData, onAnalysisComplete }: AIAnalysisScreenV2Props) {
  // Dynamic values based on planData or default
  const [pulpWhiteness, setPulpWhiteness] = useState(planData?.pulpWhiteness || 89.7)
  const [targetL, setTargetL] = useState(planData?.targetL || 60)
  const [targetA, setTargetA] = useState(planData?.targetA || 0)
  const [targetB, setTargetB] = useState(planData?.targetB || 15)
  
  const [showSection1, setShowSection1] = useState(false)
  const [showSection2, setShowSection2] = useState(false)
  const [showSection3, setShowSection3] = useState(false)
  const [showSection4, setShowSection4] = useState(false)
  const [section1Complete, setSection1Complete] = useState(false)
  const [section2Complete, setSection2Complete] = useState(false)
  const [section3Complete, setSection3Complete] = useState(false)
  
  // Section 1: Past data analysis
  const [dataPoints, setDataPoints] = useState(0)
  const [totalDataPoints, setTotalDataPoints] = useState(3000)
  const [bestCaseDate, setBestCaseDate] = useState(`2024/11/15`)
  const [deltaE, setDeltaE] = useState("7.5")
  const [successRate, setSuccessRate] = useState("95")
  const [maxIterations, setMaxIterations] = useState(75)
  const [stabilityTime, setStabilityTime] = useState(28)
  
  // Section 2: Inference
  const [inferenceProgress, setInferenceProgress] = useState(0)
  const [showInferenceResult, setShowInferenceResult] = useState(false)
  
  // Section 3: Iterative optimization
  const [simulationIteration, setSimulationIteration] = useState(0)
  const [currentScore, setCurrentScore] = useState(45)
  const [bestScore, setBestScore] = useState(45)
  const [graphData, setGraphData] = useState<number[]>([])
  const [historicalPaths, setHistoricalPaths] = useState<number[][]>([])
  const [finalOptimalPath, setFinalOptimalPath] = useState<number[]>([])
  
  // Section 4: Final result
  const [showFinalResult, setShowFinalResult] = useState(false)

  useEffect(() => {
    // Generate random values on client side only
    if (!planData) {
      setPulpWhiteness(85 + Math.random() * 10)
      setTargetL(50 + Math.random() * 20)
      setTargetA(-5 + Math.random() * 10)
      setTargetB(10 + Math.random() * 20)
    }
    
    const dataPointsTarget = 2000 + Math.floor(Math.random() * 2000)
    setTotalDataPoints(dataPointsTarget)
    setBestCaseDate(`2024/${10 + Math.floor(Math.random() * 3)}/${1 + Math.floor(Math.random() * 28)}`)
    setDeltaE((5 + Math.random() * 5).toFixed(1))
    setSuccessRate((90 + Math.random() * 9).toFixed(0))
    setMaxIterations(50 + Math.floor(Math.random() * 50))
    setStabilityTime(25 + Math.floor(Math.random() * 10))
    
    // Section 1: Past data analysis (1 second)
    const timer1 = setTimeout(() => {
      setShowSection1(true)
      
      // Animate data points counter
      let counter = 0
      const targetPoints = dataPointsTarget
      const increment = Math.ceil(targetPoints / 30) // Fixed increment based on target
      const interval = setInterval(() => {
        counter += increment
        if (counter >= targetPoints) {
          counter = targetPoints
          clearInterval(interval)
          setSection1Complete(true)
        }
        setDataPoints(counter)
      }, 50)
    }, 1000)

    // Section 2: Inference based on past data (3 seconds)
    const timer2 = setTimeout(() => {
      setShowSection2(true)
      
      // Animate inference progress
      let progress = 0
      const inferenceInterval = setInterval(() => {
        progress += 5
        if (progress >= 100) {
          progress = 100
          clearInterval(inferenceInterval)
          setSection2Complete(true)
          setShowInferenceResult(true)
        }
        setInferenceProgress(progress)
      }, 50)
    }, 3000)

    // Section 3: Iterative Simulation (6 seconds - runs for 10 seconds)
    const timer3 = setTimeout(() => {
      setShowSection3(true)
      
      let iteration = 0
      let currentBestScore = 45
      const paths: number[][] = []
      
      const simulationInterval = setInterval(() => {
        iteration++
        
        // Generate new path with gradual improvement
        const newPath = []
        const iterationProgress = iteration / maxIterations // 0 to 1
        
        for (let i = 0; i <= 20; i++) {
          const x = i * 20
          const targetY = 57
          const progress = i / 20
          
          // Gradually improve towards the end
          let y
          if (iterationProgress < 0.3) {
            // Early iterations: big overshoot and randomness
            const noise = (Math.random() - 0.5) * 40
            y = 140 - (140 - targetY) * (1 - Math.exp(-5 * progress)) + noise
            if (progress > 0.5) y -= 25 // Big overshoot
          } else if (iterationProgress < 0.6) {
            // Middle iterations: reducing problems
            const noise = (Math.random() - 0.5) * 25
            y = 140 - (140 - targetY) * (1 - Math.exp(-4 * progress)) + noise
            if (progress > 0.6 && Math.random() > 0.6) y -= 10 // Some overshoot
          } else if (iterationProgress < 0.9) {
            // Later iterations: getting better
            const noise = (Math.random() - 0.5) * 15
            y = 140 - (140 - targetY) * (1 - Math.exp(-3.5 * progress)) + noise * 0.7
          } else {
            // Final iterations: nearly optimal with small variations
            const noise = (Math.random() - 0.5) * 5
            y = 140 - (140 - targetY) * (1 - Math.exp(-3 * progress)) + noise
            // Stay very close to target
            if (progress > 0.7) {
              y = targetY + (Math.random() - 0.5) * 3
            }
          }
          
          newPath.push(Math.max(25, Math.min(140, y)))
        }
        
        // Calculate score - ensure it reaches high values at the end
        let score
        if (iterationProgress < 0.3) {
          // Early: low scores (45-60)
          score = 45 + Math.random() * 15
        } else if (iterationProgress < 0.6) {
          // Middle: improving (60-75)
          score = 60 + Math.random() * 15
        } else if (iterationProgress < 0.9) {
          // Later: good scores (75-90)
          score = 75 + Math.random() * 15
        } else {
          // Final iterations: excellent scores (90-98)
          score = 90 + Math.random() * 8
          // Ensure last iteration has highest score
          if (iteration === maxIterations) {
            score = 96 + Math.random() * 2
          }
        }
        
        setSimulationIteration(iteration)
        setCurrentScore(Math.round(score))
        setGraphData([...newPath])
        
        // Keep history of paths (frequency based on maxIterations)
        const pathFrequency = Math.max(5, Math.floor(maxIterations / 10))
        if (iteration % pathFrequency === 0) {
          paths.push([...newPath])
          if (paths.length > 5) paths.shift()
          setHistoricalPaths([...paths])
        }
        
        if (score > currentBestScore) {
          currentBestScore = score
          setBestScore(Math.round(score))
        }
        
        if (iteration >= maxIterations) {
          clearInterval(simulationInterval)
          setSection3Complete(true)
          setFinalOptimalPath([...newPath]) // Save the final optimal path
          if (onAnalysisComplete) {
            onAnalysisComplete([...newPath], stabilityTime)
          }
        }
      }, 100) // 100ms per iteration, total time depends on iteration count
    }, 6000)
    
    // Section 4: Final summary (after simulation completes)
    // Timing depends on maxIterations: 6s + (maxIterations * 0.1s)
    const timer4 = setTimeout(() => {
      setShowSection4(true)
      setShowFinalResult(true)
    }, 6000 + (maxIterations * 100) + 1000) // Add 1s buffer after simulation

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [planData])

  return (
    <div className="h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-6 overflow-auto">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
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

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${section1Complete ? 'bg-green-500' : showSection1 ? 'bg-orange-500 animate-pulse' : 'bg-neutral-700'}`}>
              <span className="text-white text-sm font-bold">1</span>
            </div>
            <div className={`w-20 h-1 ${section1Complete ? 'bg-green-500' : 'bg-neutral-700'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${section2Complete ? 'bg-green-500' : showSection2 ? 'bg-orange-500 animate-pulse' : 'bg-neutral-700'}`}>
              <span className="text-white text-sm font-bold">2</span>
            </div>
            <div className={`w-20 h-1 ${section2Complete ? 'bg-green-500' : 'bg-neutral-700'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${section3Complete ? 'bg-green-500' : showSection3 ? 'bg-orange-500 animate-pulse' : 'bg-neutral-700'}`}>
              <span className="text-white text-sm font-bold">3</span>
            </div>
            <div className={`w-20 h-1 ${section3Complete ? 'bg-green-500' : 'bg-neutral-700'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${showFinalResult ? 'bg-green-500' : showSection4 ? 'bg-orange-500 animate-pulse' : 'bg-neutral-700'}`}>
              <span className="text-white text-sm font-bold">4</span>
            </div>
          </div>
        </div>

        {/* Main Content - Vertical Steps */}
        <div className="space-y-6">
          
          {/* Step 1: Past Data Analysis */}
          <div className={`transition-all duration-1000 ${showSection1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card className="bg-neutral-800/80 border-neutral-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-white">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Database className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div>Step 1: 過去実績分析</div>
                    <div className="text-sm text-neutral-400 font-normal mt-1">類似条件のデータを検索中...</div>
                  </div>
                  {section1Complete && (
                    <CheckCircle2 className="w-6 h-6 text-green-400 ml-auto" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-neutral-900/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-neutral-400">データ検索進捗</span>
                      <span className="text-sm font-mono text-blue-400">{dataPoints.toLocaleString()} / {totalDataPoints.toLocaleString()}</span>
                    </div>
                    <Progress value={(dataPoints / totalDataPoints) * 100} className="h-2" />
                  </div>
                  
                  {section1Complete && (
                    <>
                      <div className="bg-neutral-900/50 p-3 rounded-lg">
                        <div className="text-xs text-neutral-400 mb-2">検索条件</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-neutral-500">パルプ白色度:</span>
                            <span className="text-blue-400 font-mono">{pulpWhiteness.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">目標L*:</span>
                            <span className="text-blue-400 font-mono">{targetL.toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">目標a*:</span>
                            <span className="text-blue-400 font-mono">{targetA.toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">目標b*:</span>
                            <span className="text-blue-400 font-mono">{targetB.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-sm text-green-300 font-medium">最優良事例を発見</span>
                        </div>
                        <div className="text-xs text-neutral-400 mt-1">
                          {bestCaseDate} - ΔE: {deltaE} (成功率 {successRate}%)
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 2: Inference from Past Data */}
          <div className={`transition-all duration-1000 ${showSection2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card className="bg-neutral-800/80 border-neutral-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-white">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Brain className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div>Step 2: 初期プラン推論</div>
                    <div className="text-sm text-neutral-400 font-normal mt-1">過去実績をもとに初期プランを生成中...</div>
                  </div>
                  {section2Complete && (
                    <CheckCircle2 className="w-6 h-6 text-green-400 ml-auto" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-neutral-900/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-neutral-400">推論プロセス</span>
                      <span className="text-sm font-mono text-purple-400">{inferenceProgress}%</span>
                    </div>
                    <Progress value={inferenceProgress} className="h-2" />
                  </div>
                  
                  {showInferenceResult && (
                    <div className="space-y-3">
                      <div className="bg-neutral-900/50 p-3 rounded-lg">
                        <div className="text-xs text-neutral-400 mb-2">推論された初期プラン</div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-neutral-300">ベース事例</span>
                            <span className="text-xs font-mono text-blue-400">{bestCaseDate} 成功事例</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-neutral-300">類似度</span>
                            <span className="text-xs font-mono text-green-400">{(88 + Math.random() * 10).toFixed(0)}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-neutral-300">推定所要時間</span>
                            <span className="text-xs font-mono text-orange-400">{40 + Math.floor(Math.random() * 20)}分</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          <div>
                            <span className="text-xs text-yellow-300">
                              注意: パルプ白色度の違いにより調整が必要
                            </span>
                            <div className="text-xs text-neutral-400 mt-1">
                              過去事例: {(pulpWhiteness - 2 - Math.random()).toFixed(1)}% → 現在: {pulpWhiteness.toFixed(1)}% (差分: +{(1 + Math.random() * 3).toFixed(1)}%)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 3: Iterative Optimization */}
          <div className={`transition-all duration-1000 ${showSection3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card className="bg-neutral-800/80 border-neutral-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-white">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Cpu className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <div>Step 3: 物理力学モデルにおける反復的最適化シミュレーション</div>
                    <div className="text-sm text-neutral-400 font-normal mt-1">
                      {section3Complete ? '最適化完了' : `試行 #${simulationIteration} を実行中...`}
                    </div>
                  </div>
                  {section3Complete && (
                    <CheckCircle2 className="w-6 h-6 text-green-400 ml-auto" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {/* Left: Real-time Graph */}
                  <div className="bg-neutral-900/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-neutral-300">シミュレーション結果</span>
                      <span className="text-xs font-mono text-orange-400">
                        スコア: {currentScore}/100
                      </span>
                    </div>
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
                        
                        {/* Historical paths (faded) */}
                        {historicalPaths.map((path, idx) => (
                          <path
                            key={idx}
                            d={`M 40 140 ${path.map((y, i) => `L ${40 + i * 16} ${y}`).join(' ')}`}
                            stroke="#ef4444"
                            strokeWidth="1"
                            fill="none"
                            opacity={0.1 + idx * 0.1}
                          />
                        ))}
                        
                        {/* Current path */}
                        {graphData.length > 0 && (
                          <path
                            d={`M 40 140 ${graphData.map((y, i) => `L ${40 + i * 16} ${y}`).join(' ')}`}
                            stroke={currentScore > 80 ? "#10b981" : currentScore > 60 ? "#f59e0b" : "#ef4444"}
                            strokeWidth="2"
                            fill="none"
                          />
                        )}
                        
                        {/* Labels */}
                        <text x="38" y="61" className="text-xs fill-green-400" textAnchor="end">
                          目標
                        </text>
                        <text x="38" y="144" className="text-xs fill-orange-400" textAnchor="end">
                          開始
                        </text>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Right: Metrics */}
                  <div className="space-y-3">
                    <div className="bg-neutral-900/50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-neutral-400">試行回数</span>
                        <span className="text-lg font-mono text-white">{simulationIteration}</span>
                      </div>
                      <Progress value={(simulationIteration / maxIterations) * 100} className="h-2" />
                    </div>
                    
                    <div className="bg-neutral-900/50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-neutral-400">現在のスコア</span>
                        <span className={`text-lg font-mono ${currentScore > 80 ? 'text-green-400' : currentScore > 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {currentScore}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${currentScore > 80 ? 'bg-green-500' : currentScore > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${currentScore}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-neutral-900/50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-neutral-400">最高スコア</span>
                        <span className="text-lg font-mono text-purple-400">{bestScore}</span>
                      </div>
                    </div>
                    
                    {section3Complete && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-green-400" />
                          <span className="text-xs text-green-300">
                            最適解を発見！オーバーシュートなし
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 4: Final Result */}
          <div className={`transition-all duration-1000 ${showSection4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card className="bg-gradient-to-r from-orange-600/20 to-orange-500/20 border-orange-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-white">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Target className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div>最適化完了</div>
                    <div className="text-sm text-neutral-400 font-normal mt-1">
                      AIエージェントが最適な制御プランを導出しました
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              {showFinalResult && (
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-neutral-900/50 p-3 rounded text-center">
                      <div className="text-xs text-neutral-400">安定時間</div>
                      <div className="text-lg font-bold text-green-400">{stabilityTime}分</div>
                      <div className="text-xs text-green-400">-{30 + Math.floor(Math.random() * 15)}%</div>
                    </div>
                    <div className="bg-neutral-900/50 p-3 rounded text-center">
                      <div className="text-xs text-neutral-400">オーバーシュート</div>
                      <div className="text-lg font-bold text-green-400">0回</div>
                      <div className="text-xs text-green-400">完全回避</div>
                    </div>
                    <div className="bg-neutral-900/50 p-3 rounded text-center">
                      <div className="text-xs text-neutral-400">成功確率</div>
                      <div className="text-lg font-bold text-purple-400">{(95 + Math.random() * 4).toFixed(1)}%</div>
                      <div className="text-xs text-purple-400">高信頼度</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-neutral-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-orange-400" />
                      <div>
                        <div className="text-sm font-medium text-orange-300">AIエージェント協調完了</div>
                        <div className="text-xs text-neutral-400 mt-1">
                          3つのAIエージェントが{maxIterations}回のシミュレーションを通じて最適解を導出しました
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}