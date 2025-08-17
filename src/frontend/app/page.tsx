"use client"

import { useState } from "react"
import { ChevronRight, Monitor, Settings, Shield, Target, Bell, RefreshCw, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PlanCreationScreen } from "@/components/plan-creation-screen"
import { AIAnalysisScreenV2 } from "@/components/ai-analysis-screen-v2"
import { RecommendationScreen } from "@/components/recommendation-screen"
import { ExecutionScreen } from "@/components/execution-screen"
import { ColorMaintenanceScreen } from "@/components/color-maintenance-screen"

export default function FactoryProductionSystem() {
  const [activeSection, setActiveSection] = useState("plan")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [planData, setPlanData] = useState(null)
  const [optimalPath, setOptimalPath] = useState<number[]>([])
  const [stabilityTime, setStabilityTime] = useState<number>(28)

  const handleStartAnalysis = (data: any) => {
    setPlanData(data)
    setActiveSection("analysis")
  }

  const handleExecutePlan = () => {
    setActiveSection("execution")
  }

  const getCurrentSectionName = () => {
    switch (activeSection) {
      case "plan":
        return "色替え計画の作成"
      case "analysis":
        return "AIエージェント分析"
      case "recommendation":
        return "色替え計画"
      case "execution":
        return "色替え実施"
      case "maintenance":
        return "色相維持"
      default:
        return ""
    }
  }

  const getLastUpdateTime = () => {
    const now = new Date()
    return `${now.toLocaleDateString("ja-JP")} ${now.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} JST`
  }

  return (
    <div className="flex h-screen bg-neutral-950">
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-72"} bg-neutral-900 border-r border-neutral-700 transition-all duration-300 fixed md:relative z-50 md:z-auto h-full md:h-auto ${!sidebarCollapsed ? "md:block" : ""}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <h1 className="text-orange-500 font-bold text-lg tracking-wider">FACTORY OPS</h1>
              <p className="text-neutral-500 text-xs">v3.2.1 PRODUCTION</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-neutral-400 hover:text-orange-500"
            >
              <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
              />
            </Button>
          </div>

          <nav className="space-y-2">
            {[
              { id: "plan", icon: Monitor, label: "色替え計画の作成" },
              { id: "analysis", icon: Shield, label: "AIエージェント分析" },
              { id: "recommendation", icon: Target, label: "色替え計画" },
              { id: "execution", icon: Settings, label: "色替え実施" },
              { id: "maintenance", icon: Eye, label: "色相維持" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${
                  activeSection === item.id
                    ? "bg-orange-500 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <item.icon className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className="mt-8 p-4 bg-neutral-800 border border-neutral-700 rounded">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">システム稼働中</span>
              </div>
              <div className="text-xs text-neutral-500">
                <div>稼働時間: 72:14:33</div>
                <div>ライン状態: 正常</div>
                <div>パルプ白色度: 89.7%</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${!sidebarCollapsed ? "md:ml-0" : ""}`}>
        {/* Top Toolbar */}
        <div className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-400">
              生産管理システム / <span className="text-orange-500">{getCurrentSectionName()}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-neutral-500">最終更新: {getLastUpdateTime()}</div>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
          {activeSection === "plan" && <PlanCreationScreen onStartAnalysis={handleStartAnalysis} />}
          {activeSection === "analysis" && (
            <AIAnalysisScreenV2 
              planData={planData} 
              onAnalysisComplete={(path, time) => {
                setOptimalPath(path)
                setStabilityTime(time)
                // Transition to recommendation screen after 3 seconds
                setTimeout(() => {
                  setActiveSection("recommendation")
                }, 3000)
              }}
            />
          )}
          {activeSection === "recommendation" && (
            <RecommendationScreen 
              onExecutePlan={handleExecutePlan} 
              planData={planData}
              optimalPath={optimalPath}
              stabilityTime={stabilityTime}
            />
          )}
          {activeSection === "execution" && (
            <ExecutionScreen 
              planData={planData} 
              optimalPath={optimalPath} 
              stabilityTime={stabilityTime}
              onComplete={() => setActiveSection("maintenance")}
            />
          )}
          {activeSection === "maintenance" && <ColorMaintenanceScreen />}
        </div>
      </div>
    </div>
  )
}