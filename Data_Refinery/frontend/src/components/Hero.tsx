"use client"

import { motion } from "framer-motion"
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react"

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                        <Sparkles size={14} />
                        AI-Powered Data Cleaning
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                        Refine Your Data into <br />
                        <span className="gradient-text">Pure Intelligence</span>
                    </h1>
                    <p className="text-xl text-foreground/60 max-w-2xl mx-auto mb-10">
                        Automatically detect errors, handle missing values, and generate professional quality reports. Transform raw datasets into industry-ready assets in seconds.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="#upload" className="btn-primary flex items-center gap-2">
                            Start Cleaning Now <ArrowRight size={18} />
                        </a>
                        <a href="/sample_data.csv" download className="btn-secondary">
                            Download Sample CSV
                        </a>
                    </div>

                    <div className="mt-16 flex items-center justify-center gap-8 text-foreground/40 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-500" /> Professional Reports
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-500" /> Automated Cleaning
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-500" /> Export Ready
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
