"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ArrowRight, Zap, Target, Database, Activity, TrendingUp, AlertCircle } from "lucide-react"

interface PlanCreationScreenProps {
  onStartAnalysis: (data: any) => void
}

export function PlanCreationScreen({ onStartAnalysis }: PlanCreationScreenProps) {
  // Initialize with default values, will be randomized in useEffect
  const [pulpWhiteness, setPulpWhiteness] = useState(89.7)
  const [currentValues, setCurrentValues] = useState({ 
    L: 85.0, 
    a: 0.0, 
    b: 12.0 
  })
  
  const [targetL, setTargetL] = useState(92.0)
  const [targetA, setTargetA] = useState(-2.0)
  const [targetB, setTargetB] = useState(8.0)
  
  // Generate random values on client side only
  useEffect(() => {
    const pw = 85 + Math.random() * 10
    const cv = {
      L: 80 + Math.random() * 15,
      a: -5 + Math.random() * 10,
      b: 10 + Math.random() * 15
    }
    
    setPulpWhiteness(pw)
    setCurrentValues(cv)
    setTargetL(cv.L + 5 + Math.random() * 10)
    setTargetA(cv.a + (-2 + Math.random() * 4))
    setTargetB(cv.b + (-5 + Math.random() * 10))
  }, [])

  // Calculate color difference (ΔE)
  const calculateDeltaE = () => {
    const deltaL = targetL - currentValues.L
    const deltaA = targetA - currentValues.a
    const deltaB = targetB - currentValues.b
    return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB)
  }

  // Calculate individual differences
  const calculateDifferences = () => {
    return {
      deltaE: calculateDeltaE(),
      deltaL: targetL - currentValues.L,
      deltaChroma: Math.sqrt(targetA * targetA + targetB * targetB) - 
                   Math.sqrt(currentValues.a * currentValues.a + currentValues.b * currentValues.b)
    }
  }

  const labToRgb = (L: number, a: number, b: number) => {
    const r = Math.max(0, Math.min(255, L * 2.55 + a * 1.5))
    const g = Math.max(0, Math.min(255, L * 2.55 - a * 0.5 - b * 0.5))
    const blue = Math.max(0, Math.min(255, L * 2.55 - b * 2))
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(blue)})`
  }

  const handleStartAnalysis = () => {
    const data = {
      pulpWhiteness: pulpWhiteness,
      currentValues: currentValues,
      targetValues: { L: targetL, a: targetA, b: targetB },
      targetL: targetL,
      targetA: targetA,
      targetB: targetB,
      deltaE: calculateDeltaE()
    }
    onStartAnalysis(data)
  }

  const differences = calculateDifferences()

  return (
    <div className="h-full p-6 overflow-auto bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400 font-semibold">システム稼働中</span>
          </div>
          <h1 className="text-3xl font-bold text-white">色替え計画の作成</h1>
          <h2 className="text-lg text-orange-500 font-semibold mt-2">STEP 1: 実行条件の入力</h2>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Current Product */}
          <div>
            <Card className="bg-neutral-900 border-neutral-700 shadow-lg h-full">
              <CardHeader className="pb-4 bg-blue-950/30 rounded-t-lg">
                <CardTitle className="text-xl flex items-center gap-2 text-neutral-200">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  前製品の規格値
                  <span className="text-sm text-neutral-400 font-normal ml-2">(自動取得)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Color Preview */}
                <div className="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700 mb-6">
                  <div
                    className="w-full h-32 rounded-xl border-4 border-neutral-600 shadow-inner mb-3"
                    style={{ backgroundColor: labToRgb(currentValues.L, currentValues.a, currentValues.b) }}
                  ></div>
                  <p className="text-sm text-neutral-400 font-mono text-center">
                    Lab({currentValues.L.toFixed(1)}, {currentValues.a.toFixed(1)}, {currentValues.b.toFixed(1)})
                  </p>
                </div>

                {/* Lab Values Display with Gradients */}
                <div className="space-y-5">
                  {/* L Value */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-neutral-400">L値 (明度)</span>
                      <span className="text-lg font-mono text-white font-bold">{currentValues.L.toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-gradient-to-r from-black to-white h-3 rounded-full relative">
                      <div className="absolute w-4 h-5 bg-blue-500 rounded-full -top-1 border-2 border-white" 
                           style={{ left: `${currentValues.L}%` }}></div>
                    </div>
                  </div>

                  {/* a Value */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-neutral-400">a値 (赤-緑)</span>
                      <span className="text-lg font-mono text-white font-bold">{currentValues.a.toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-gradient-to-r from-green-500 to-red-500 h-3 rounded-full relative">
                      <div className="absolute w-4 h-5 bg-blue-500 rounded-full -top-1 border-2 border-white" 
                           style={{ left: `${50 + (currentValues.a / 60) * 50}%` }}></div>
                    </div>
                  </div>

                  {/* b Value */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-neutral-400">b値 (青-黄)</span>
                      <span className="text-lg font-mono text-white font-bold">{currentValues.b.toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-gradient-to-r from-blue-500 to-yellow-500 h-3 rounded-full relative">
                      <div className="absolute w-4 h-5 bg-blue-500 rounded-full -top-1 border-2 border-white" 
                           style={{ left: `${50 + (currentValues.b / 60) * 50}%` }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Target Product */}
          <div>
            <Card className="bg-neutral-900 border-neutral-700 shadow-lg h-full">
              <CardHeader className="pb-4 bg-orange-950/30 rounded-t-lg">
                <CardTitle className="text-xl flex items-center gap-2 text-neutral-200">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  後製品の目標規格値
                  <span className="text-sm text-neutral-400 font-normal ml-2">(入力)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Color Preview */}
                <div className="bg-neutral-800/50 p-6 rounded-xl border border-orange-500/30 mb-6">
                  <div
                    className="w-full h-32 rounded-xl border-4 border-orange-500/50 shadow-inner mb-3"
                    style={{ backgroundColor: labToRgb(targetL, targetA, targetB) }}
                  ></div>
                  <p className="text-sm text-neutral-400 font-mono text-center">
                    Lab({targetL.toFixed(1)}, {targetA.toFixed(1)}, {targetB.toFixed(1)})
                  </p>
                </div>

                {/* Lab Values Input with Gradients */}
                <div className="space-y-5">
                  {/* L Value */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-neutral-400">L値 (明度) 0-100</span>
                      <Input
                        type="number"
                        value={parseFloat(targetL.toFixed(1))}
                        onChange={(e) => setTargetL(Number(e.target.value))}
                        className="w-24 h-9 bg-neutral-800 border border-orange-500/50 text-orange-400 font-mono text-sm text-center"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    <Slider
                      value={[targetL]}
                      onValueChange={(value) => setTargetL(value[0])}
                      min={0}
                      max={100}
                      step={0.1}
                      className="w-full mb-2"
                    />
                    <div className="w-full bg-gradient-to-r from-black to-white h-3 rounded-full relative">
                      <div className="absolute w-4 h-5 bg-orange-500 rounded-full -top-1 border-2 border-white" 
                           style={{ left: `${targetL}%` }}></div>
                    </div>
                  </div>

                  {/* a Value */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-neutral-400">a値 (赤-緑) -60～+60</span>
                      <Input
                        type="number"
                        value={parseFloat(targetA.toFixed(1))}
                        onChange={(e) => setTargetA(Number(e.target.value))}
                        className="w-24 h-9 bg-neutral-800 border border-orange-500/50 text-orange-400 font-mono text-sm text-center"
                        min="-60"
                        max="60"
                        step="0.1"
                      />
                    </div>
                    <Slider
                      value={[targetA]}
                      onValueChange={(value) => setTargetA(value[0])}
                      min={-60}
                      max={60}
                      step={0.1}
                      className="w-full mb-2"
                    />
                    <div className="w-full bg-gradient-to-r from-green-500 to-red-500 h-3 rounded-full relative">
                      <div className="absolute w-4 h-5 bg-orange-500 rounded-full -top-1 border-2 border-white" 
                           style={{ left: `${50 + (targetA / 60) * 50}%` }}></div>
                    </div>
                  </div>

                  {/* b Value */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-neutral-400">b値 (青-黄) -60～+60</span>
                      <Input
                        type="number"
                        value={parseFloat(targetB.toFixed(1))}
                        onChange={(e) => setTargetB(Number(e.target.value))}
                        className="w-24 h-9 bg-neutral-800 border border-orange-500/50 text-orange-400 font-mono text-sm text-center"
                        min="-60"
                        max="60"
                        step="0.1"
                      />
                    </div>
                    <Slider
                      value={[targetB]}
                      onValueChange={(value) => setTargetB(value[0])}
                      min={-60}
                      max={60}
                      step={0.1}
                      className="w-full mb-2"
                    />
                    <div className="w-full bg-gradient-to-r from-blue-500 to-yellow-500 h-3 rounded-full relative">
                      <div className="absolute w-4 h-5 bg-orange-500 rounded-full -top-1 border-2 border-white" 
                           style={{ left: `${50 + (targetB / 60) * 50}%` }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Analysis and Action */}
        <div className="mt-8 grid grid-cols-3 gap-6">
          {/* System Status */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Activity className="w-12 h-12 text-green-400" />
                <div>
                  <p className="text-xs text-neutral-400">生産ライン</p>
                  <p className="text-2xl font-bold text-green-400">稼働中</p>
                  <p className="text-xs text-neutral-500 mt-1">パルプ白色度: 89.7%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Difference Analysis */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-12 h-12 text-orange-400" />
                <div className="flex-1">
                  <p className="text-xs text-neutral-400 mb-2">色差分析 (自動計算)</p>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-neutral-500">ΔE値</span>
                      <span className="text-lg font-bold text-orange-400">{differences.deltaE.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-neutral-500">明度差</span>
                      <span className={`text-sm font-bold ${differences.deltaL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {differences.deltaL >= 0 ? '+' : ''}{differences.deltaL.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Start Analysis Button */}
          <Card className="bg-gradient-to-r from-orange-600 to-orange-500 border-orange-400">
            <CardContent className="pt-6 pb-6">
              <Button
                onClick={handleStartAnalysis}
                className="w-full h-full bg-transparent hover:bg-white/10 text-white font-bold transition-all duration-200 p-0"
                variant="ghost"
              >
                <div className="flex items-center justify-center gap-3">
                  <Zap className="w-10 h-10" />
                  <div className="text-left">
                    <div className="text-lg">AI分析を開始</div>
                    <div className="text-xs opacity-80">最適経路を自動探索</div>
                  </div>
                  <ArrowRight className="w-6 h-6 ml-2" />
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Banner */}
        {differences.deltaE > 10 && (
          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <p className="text-sm text-yellow-200">
              色差が大きいため、段階的な色替えが推奨されます。AI分析により最適な経路を算出します。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}