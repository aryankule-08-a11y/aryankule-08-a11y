"use client"

import { useState } from "react"

interface DataPreviewProps {
    data: any[]
}

export default function DataPreview({ data }: DataPreviewProps) {
    if (!data || data.length === 0) return null

    const columns = Object.keys(data[0])

    return (
        <div className="w-full overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center">
                <h3 className="font-bold text-lg">Cleaned Data Preview</h3>
                <span className="text-sm font-medium text-foreground/50">Showing first 10 rows</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-secondary/50">
                            {columns.map((col) => (
                                <th key={col} className="p-4 text-xs font-bold uppercase tracking-wider text-foreground/60 border-b border-border">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.slice(0, 10).map((row, i) => (
                            <tr key={i} className="hover:bg-primary/5 transition-colors border-b border-border last:border-0">
                                {columns.map((col) => (
                                    <td key={col} className="p-4 text-sm whitespace-nowrap">
                                        {String(row[col])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
