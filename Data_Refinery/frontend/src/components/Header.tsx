"use client"

import { Database, Zap, Shield, Sparkles } from "lucide-react"

export default function Header() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/50 backdrop-blur-md">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-linear-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <Database size={20} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Data<span className="text-primary">Refinery</span></span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">Features</a>
                    <a href="#how-it-works" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">How it works</a>
                    <a href="#report" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">Sample Report</a>
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-sm font-medium hover:text-primary transition-colors">Log in</button>
                    <button className="btn-primary py-2 px-4 text-sm">Get Started</button>
                </div>
            </div>
        </nav>
    )
}
