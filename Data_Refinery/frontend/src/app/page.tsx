"use client"

import { useState } from "react"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import FileUpload from "@/components/FileUpload"
import DataPreview from "@/components/DataPreview"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertCircle, BarChart3, Download, RefreshCcw, ArrowLeft, LayoutDashboard, Settings, FileSpreadsheet } from "lucide-react"
import axios from "axios"

export default function Home() {
  const [stage, setStage] = useState<"landing" | "cleaning" | "results">("landing")
  const [cleaningProgress, setCleaningProgress] = useState(0)
  const [reportData, setReportData] = useState<any>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [csvData, setCsvData] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (file: File) => {
    setStage("cleaning")
    setCleaningProgress(0)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      // Simulate progress bar while waiting for response
      const progressInterval = setInterval(() => {
        setCleaningProgress(prev => Math.min(prev + 5, 95))
      }, 500)

      const response = await axios.post("http://localhost:8000/upload", formData)

      clearInterval(progressInterval)
      setCleaningProgress(100)

      setTimeout(() => {
        setReportData(response.data.report)
        setPreviewData(response.data.preview)
        setCsvData(response.data.csv_data)
        setStage("results")
      }, 500)
    } catch (err: any) {
      clearInterval(1) // Just in case
      setError(err.response?.data?.detail || "An error occurred during cleaning. Please check your file.")
      setStage("landing")
    }
  }

  const downloadCSV = () => {
    const blob = new Blob([csvData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "cleaned_dataset.csv"
    a.click()
  }

  return (
    <main className="min-h-screen">
      <Header />

      <AnimatePresence mode="wait">
        {stage === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Hero />
            <div id="upload" className="container mx-auto px-6 pb-32">
              {error && (
                <div className="max-w-3xl mx-auto mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-center gap-3">
                  <AlertCircle size={20} />
                  <span className="font-medium">{error}</span>
                </div>
              )}
              <FileUpload onFileSelect={handleFileSelect} />
            </div>
          </motion.div>
        )}

        {stage === "cleaning" && (
          <motion.div
            key="cleaning"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="container mx-auto px-6 pt-40 pb-32 flex flex-col items-center"
          >
            <div className="w-full max-w-xl text-center">
              <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-8 relative">
                <RefreshCcw size={40} className="animate-spin" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                  {cleaningProgress}%
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Cleaning Your Dataset</h2>
              <p className="text-foreground/60 mb-12">We're handling missing values, duplicates, and outliers using advanced algorithms.</p>

              <div className="w-full bg-secondary h-4 rounded-full overflow-hidden border border-foreground/5">
                <motion.div
                  className="h-full bg-linear-to-r from-blue-500 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${cleaningProgress}%` }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 text-left">
                {[
                  { label: "Handling missing values", done: cleaningProgress > 20 },
                  { label: "Removing duplicates", done: cleaningProgress > 40 },
                  { label: "Correcting data types", done: cleaningProgress > 60 },
                  { label: "Normalizing text", done: cleaningProgress > 80 },
                ].map((step, i) => (
                  <div key={i} className={`p-4 rounded-2xl border transition-all ${step.done ? "border-green-500/20 bg-green-500/5" : "border-foreground/10 bg-secondary/50"}`}>
                    <div className="flex items-center gap-3">
                      {step.done ? <CheckCircle2 size={18} className="text-green-500" /> : <RefreshCcw size={18} className="animate-spin text-primary" />}
                      <span className={`text-sm font-medium ${step.done ? "text-green-600" : "text-foreground/50"}`}>{step.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {stage === "results" && reportData && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto px-6 pt-32 pb-32"
          >
            <button
              onClick={() => setStage("landing")}
              className="flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors mb-8 font-medium"
            >
              <ArrowLeft size={18} /> Back to Upload
            </button>

            <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-12">
              <div>
                <h2 className="text-4xl font-bold mb-2">Quality Report</h2>
                <p className="text-foreground/60">Your dataset has been refined and is ready for production.</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={downloadCSV}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Download size={18} /> Download CSV
                </button>
                <button
                  onClick={() => window.print()}
                  className="btn-primary flex items-center gap-2 shadow-xl shadow-blue-500/30"
                >
                  <BarChart3 size={18} /> Full PDF Report
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: "Data Quality Score", value: `${reportData.score}%`, desc: "Integrity", icon: LayoutDashboard },
                { label: "Initial Rows", value: reportData.stats.initial_rows.toLocaleString(), desc: "Input rows", icon: FileSpreadsheet },
                { label: "Cleaning Impact", value: (reportData.stats.duplicates_removed + reportData.stats.missing_values_fixed + reportData.stats.outliers_removed).toLocaleString(), desc: "Anomalies fixed", icon: Settings },
              ].map((stat, i) => (
                <div key={i} className="p-8 rounded-3xl bg-card border border-border shadow-sm group hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-sm font-semibold text-foreground/40 uppercase tracking-wider">{stat.label}</p>
                    <stat.icon className="text-primary/40 group-hover:text-primary transition-colors" size={20} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{stat.value}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-primary/60">
                    <CheckCircle2 size={12} />
                    {stat.desc}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="p-8 rounded-3xl bg-card border border-border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  Cleaning Actions
                </h3>
                <div className="space-y-4">
                  {reportData.actions.length > 0 ? reportData.actions.map((action: string, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50 border border-foreground/5">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-green-500" />
                        <span className="font-medium">{action}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-foreground/40 font-medium">No actions needed. Your data was already clean.</div>
                  )}
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-card border border-border flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <LayoutDashboard size={20} />
                  </div>
                </div>
                <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center mb-6 relative">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-primary"
                      strokeDasharray={2 * Math.PI * 56}
                      strokeDashoffset={2 * Math.PI * 56 * (1 - reportData.score / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-3xl font-bold tracking-tighter">{reportData.score}%</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{reportData.status}</h3>
                <p className="text-foreground/60 max-w-xs">Your data meets the standard criteria for high-precision analytics.</p>
              </div>
            </div>

            <DataPreview data={previewData} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
