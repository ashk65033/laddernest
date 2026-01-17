"use client"

import { motion } from "framer-motion"

interface PageHeaderProps {
    title: string
    description?: string
    children?: React.ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
        <div className="relative w-full overflow-hidden bg-slate-900 py-24 sm:py-32">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900/40 to-slate-900/40" />

            <div className="container relative z-10 mx-auto px-4 text-center">
                <motion.h1
                    className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {title}
                </motion.h1>

                {description && (
                    <motion.p
                        className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {description}
                    </motion.p>
                )}

                {children && (
                    <motion.div
                        className="mt-10 flex items-center justify-center gap-x-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {children}
                    </motion.div>
                )}
            </div>
        </div>
    )
}
