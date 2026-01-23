"use client"

import { useState, useCallback } from "react"
import { Upload, X, FileText, CheckCircle2, Loader2, Database } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FileUploadProps {
    onFileSelect: (file: File) => void
    isUploading?: boolean
}

export default function FileUpload({ onFileSelect, isUploading }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file && (file.type === "text/csv" || file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
            setSelectedFile(file)
            onFileSelect(file)
        }
    }, [onFileSelect])

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            onFileSelect(file)
        }
    }, [onFileSelect])

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dotted rounded-3xl p-12 transition-all duration-300 flex flex-col items-center justify-center gap-6 ${isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-foreground/10 hover:border-primary/50"
                    }`}
            >
                <AnimatePresence mode="wait">
                    {!selectedFile ? (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Upload size={32} />
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-semibold mb-1">Drag & drop your dataset</p>
                                <p className="text-foreground/50">Supports CSV, XLS, XLSX up to 500MB</p>
                            </div>
                            <label className="btn-primary cursor-pointer mt-4">
                                Browse Files
                                <input type="file" className="hidden" accept=".csv, .xlsx, .xls" onChange={handleFileChange} />
                            </label>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="selected"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center gap-4 w-full"
                        >
                            <div className="w-full p-4 rounded-2xl bg-secondary flex items-center justify-between border border-foreground/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <Database size={24} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-sm truncate max-w-[200px]">{selectedFile.name}</p>
                                        <p className="text-xs text-foreground/50">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedFile(null)}
                                    className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {isUploading ? (
                                <div className="flex items-center gap-3 text-primary animate-pulse font-medium">
                                    <Loader2 className="animate-spin" size={20} />
                                    Processing dataset...
                                </div>
                            ) : (
                                <button
                                    onClick={() => onFileSelect(selectedFile)}
                                    className="btn-primary w-full py-4 mt-2 flex items-center justify-center gap-2"
                                >
                                    Confirm & Clean Data
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
