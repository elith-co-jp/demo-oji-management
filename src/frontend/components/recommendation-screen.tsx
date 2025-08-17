"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, CheckCircle, Settings, Beaker, Play } from "lucide-react"

interface RecommendationScreenProps {
  onExecutePlan: () => void
  planData?: any
  optimalPath?: number[]
  stabilityTime?: number
}

export function RecommendationScreen({ onExecutePlan, planData, optimalPath, stabilityTime = 28 }: RecommendationScreenProps) {
  const dyeUsage = [
    { name: "Black", amount: 0.8, color: "#000000", percentage: 15 },
    { name: "Red", amount: 2.3, color: "#ef4444", percentage: 42 },
    { name: "Blue", amount: 1.2, color: "#3b82f6", percentage: 22 },
    { name: "Orange", amount: 0.5, color: "#f97316", percentage: 9 },
    { name: "Violet", amount: 0.3, color: "#8b5cf6", percentage: 5 },
    { name: "Yellow", amount: 0.4, color: "#eab308", percentage: 7 },
  ]

  const controlSequence = [
    {
      time: "10:00",
      tag: "YFS-001",
      action: "SV = 0.850",
      note: "No.1染料比率設定",
      priority: "高",
      oldValue: "0.821",
    },
    {
      time: "10:02",
      tag: "YFS-005",
      action: "SV = 0.414",
      note: "No.5染料比率設定",
      priority: "高",
      oldValue: "0.385",
    },
    {
      time: "10:05",
      tag: "YFI-006",
      action: "PV = 3.37 L/M",
      note: "No.1染料流量 HI",
      priority: "中",
      oldValue: "2.85 L/M",
    },
    {
      time: "10:08",
      tag: "YLI-012",
      action: "PV = 78.0 %",
      note: "染料タンク液面 Recover",
      priority: "中",
      oldValue: "65.0 %",
    },
    {
      time: "10:12",
      tag: "YP-012",
      action: "AUT",
      note: "No.1染料添加P 自動化",
      priority: "高",
      oldValue: "MAN",
    },
    {
      time: "10:15",
      tag: "YFI-010",
      action: "PV = 2.17 L/M",
      note: "No.5染料流量調整",
      priority: "中",
      oldValue: "1.85 L/M",
    },
    {
      time: "10:18",
      tag: "CT290003",
      action: "PV = 0",
      note: "No.3染料工程完了",
      priority: "低",
      oldValue: "4",
    },
    {
      time: "10:22",
      tag: "TM290009",
      action: "PH = 500",
      note: "染料LO遅延タイマー",
      priority: "低",
      oldValue: "700",
    },
    {
      time: "10:25",
      tag: "YFS-001",
      action: "SV = 0.821",
      note: "最終調整",
      priority: "完了",
      oldValue: "0.850",
    },
  ]

  const handleExecutePlan = () => {
    onExecutePlan()
  }

  return (
    <div className="h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-6 overflow-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center items-center gap-3 mb-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-sm text-green-400 font-medium">AI分析完了</span>
        </div>
        <h1 className="text-3xl font-bold text-white">色替え計画</h1>
        <h2 className="text-lg text-orange-400 font-medium mt-2">STEP 3: 計画の確認と実行</h2>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Top Stats Row */}
        <div className="col-span-12 grid grid-cols-3 gap-4 mb-4">
          <Card className="bg-neutral-800/80 border-neutral-700">
            <CardContent className="pt-4">
              <div className="text-center">
                <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-xs text-neutral-400">安定到達時間</p>
                <p className="text-xl font-bold text-green-400">{stabilityTime}分</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-800/80 border-neutral-700">
            <CardContent className="pt-4">
              <div className="text-center">
                <Beaker className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <p className="text-xs text-neutral-400">染料使用量</p>
                <p className="text-xl font-bold text-orange-400">5.5kg</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-800/80 border-neutral-700">
            <CardContent className="pt-4">
              <div className="text-center">
                <CheckCircle className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-xs text-neutral-400">成功確率</p>
                <p className="text-xl font-bold text-purple-400">98.7%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Left Column - Dye Usage */}
        <div className="col-span-3">
          <Card className="bg-neutral-800/90 border-neutral-700 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Beaker className="w-4 h-4 text-orange-400" />
                染料使用量計画
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {dyeUsage.map((dye, index) => (
                <div key={index} className="bg-neutral-900/50 p-2 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: dye.color }}
                      ></div>
                      <span className="text-neutral-300 text-xs">{dye.name}</span>
                    </div>
                    <span className="text-white text-xs font-bold">{dye.amount}kg</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${dye.percentage}%`,
                        backgroundColor: dye.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Center - Color Transition */}
        <div className="col-span-6">
          <Card className="bg-neutral-800/90 border-neutral-700 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-orange-400" />
                色変遷シミュレーション
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-neutral-900/50 rounded-lg p-4">
                <svg width="100%" height="280" viewBox="0 0 400 200" className="text-white">
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
                  
                  {/* Optimal path from AI analysis */}
                  {optimalPath && optimalPath.length > 0 && (
                    <path
                      d={`M 40 140 ${optimalPath.map((y, i) => `L ${40 + i * 16} ${y}`).join(' ')}`}
                      stroke="#10b981"
                      strokeWidth="2.5"
                      fill="none"
                    />
                  )}
                  
                  {/* Default path if no optimal path */}
                  {(!optimalPath || optimalPath.length === 0) && (
                    <path
                      d="M 40 140 Q 150 100 200 75 Q 300 60 360 57"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      fill="none"
                    />
                  )}
                  
                  {/* Control points */}
                  {optimalPath && optimalPath.length > 0 && [0, 5, 10, 15, 20].map((idx) => (
                    idx < optimalPath.length && (
                      <circle
                        key={idx}
                        cx={40 + idx * 16}
                        cy={optimalPath[idx]}
                        r="3"
                        fill="#10b981"
                        opacity="0.8"
                      />
                    )
                  ))}
                  
                  {/* Labels */}
                  <text x="38" y="61" className="text-xs fill-green-400" textAnchor="end">
                    目標
                  </text>
                  <text x="38" y="144" className="text-xs fill-orange-400" textAnchor="end">
                    開始
                  </text>
                  <text x="200" y="190" className="text-xs fill-neutral-400" textAnchor="middle">
                    時間経過
                  </text>

                  {/* Time axis */}
                  {[0, 5, 10, 15, 20, 25, 30].map((time, i) => (
                    <text key={i} x={40 + i * 53} y="175" fill="#a3a3a3" fontSize="9" textAnchor="middle">
                      {time}
                    </text>
                  ))}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Control Sequence */}
        <div className="col-span-3">
          <Card className="bg-neutral-800/90 border-neutral-700 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-400" />
                制御シーケンス
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {controlSequence.map((step, index) => (
                    <div
                      key={index}
                      className={`bg-neutral-900/50 p-2 rounded-lg border-l-2 ${
                        step.priority === "高"
                          ? "border-red-500"
                          : step.priority === "中"
                          ? "border-yellow-500"
                          : step.priority === "低"
                          ? "border-blue-500"
                          : "border-green-500"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-neutral-500 font-mono">{step.time}</span>
                            <span className="text-xs font-bold text-orange-400">{step.tag}</span>
                          </div>
                          <div className="text-xs text-white font-mono">{step.action}</div>
                          {step.oldValue && (
                            <div className="text-xs text-neutral-500 mt-1">
                              old = {step.oldValue}
                            </div>
                          )}
                          <div className="text-xs text-neutral-400 mt-1">{step.note}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Bottom - Action Button */}
        <div className="col-span-12 mt-4">
          <Card className="bg-gradient-to-r from-orange-600/20 to-orange-500/20 border-orange-500/30">
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-neutral-300 mb-4">
                  AIが推奨する最適オペレーション計画の準備が完了しました
                </p>
                <Button
                  onClick={handleExecutePlan}
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                >
                  <Play className="mr-2 h-4 w-4" />
                  実行開始
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}