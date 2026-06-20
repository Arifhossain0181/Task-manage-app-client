/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Pencil, Trash2, X, Loader2 } from "lucide-react"
import { toast } from 'sonner'
import api from "../libs/axios"
import { Task, TaskStatus } from "../types/task"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/src/components/ui/select"

// Refined status palette — clearer contrast against navy background
const statusStyles: Record<TaskStatus, string> = {
  TODO: "bg-slate-500/15 text-slate-200 ring-1 ring-slate-400/30",
  IN_PROGRESS: "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/40",
  DONE: "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/40",
}

export default function TaskCard({ task }: { task: Task }) {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [status, setStatus] = useState<TaskStatus>(task.status)

  const updateMutation = useMutation({
    mutationFn: async (values: { title?: string; description?: string; status?: TaskStatus }) => {
      const res = await api.patch(`/tasks/${task.id}`, values)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      setIsEditing(false)
      toast.success('Task updated')
    },
    onError: (err: any) => {
      toast.error(err?.message ?? 'Failed to update task')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => { await api.delete(`/tasks/${task.id}`) },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      toast.success('Task deleted')
    },
    onError: (err: any) => {
      toast.error(err?.message ?? 'Failed to delete task')
    },
  })

  const handleCancel = () => {
    setTitle(task.title); setDescription(task.description); setStatus(task.status)
    setIsEditing(false)
  }
  const handleSave = () => updateMutation.mutate({ title, description, status })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      {/* glow */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-500/25 via-indigo-500/15 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

      <Card className="relative overflow-hidden rounded-2xl border border-blue-900/40 bg-[#0A1F44] backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.45)] transition-colors duration-300 hover:border-blue-500/40">
        {/* top accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/70 to-transparent" />

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <AnimatePresence mode="wait" initial={false}>
              {isEditing ? (
                <motion.div
                  key="edit-title"
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                  className="flex-1"
                >
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                    disabled={updateMutation.isPending}
                    className="bg-[#0F2A52] border-blue-900/50 text-white placeholder:text-blue-300/50 focus-visible:ring-blue-400/60"
                  />
                </motion.div>
              ) : (
                <motion.h3
                  key="view-title"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-lg font-semibold tracking-tight text-white"
                >
                  {task.title}
                </motion.h3>
              )}
            </AnimatePresence>

            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize transition-all ${statusStyles[status]}`}>
              {status.replace("_", " ").toLowerCase()}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <AnimatePresence mode="wait" initial={false}>
            {isEditing ? (
              <motion.div key="edit-desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task description"
                  disabled={updateMutation.isPending}
                  className="bg-[#0F2A52] border-blue-900/50 text-white placeholder:text-blue-300/50 focus-visible:ring-blue-400/60"
                />
              </motion.div>
            ) : (
              <motion.p
                key="view-desc"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-sm leading-relaxed text-blue-100/80"
              >
                {task.description || <span className="italic text-blue-300/40">No description provided</span>}
              </motion.p>
            )}
          </AnimatePresence>

          <Select
            value={status}
            onValueChange={(value) => {
              if (isEditing) { setStatus(value as TaskStatus); return }
              updateMutation.mutate({ status: value as TaskStatus })
            }}
            disabled={updateMutation.isPending}
          >
            <SelectTrigger className="bg-[#0F2A52] border-blue-900/50 text-white focus:ring-blue-400/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0A1F44] border-blue-900/50 text-white">
              <SelectItem value="TODO">To Do</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 pt-2">
          <AnimatePresence mode="wait" initial={false}>
            {isEditing ? (
              <motion.div
                key="edit-actions"
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                className="flex gap-2"
              >
                <Button variant="ghost" onClick={handleCancel} disabled={updateMutation.isPending}
                  className="text-blue-200 hover:text-white hover:bg-white/10">
                  <X className="mr-1.5 h-4 w-4" /> Cancel
                </Button>
                <Button onClick={handleSave} disabled={updateMutation.isPending}
                  className="bg-blue-500 text-white hover:bg-blue-400 shadow-lg shadow-blue-500/30">
                  {updateMutation.isPending
                    ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    : <Check className="mr-1.5 h-4 w-4" />}
                  {updateMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="view-actions"
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                className="flex gap-2"
              >
                <Button variant="ghost" onClick={() => setIsEditing(true)}
                  className="text-blue-200 hover:text-white hover:bg-white/10">
                  <Pencil className="mr-1.5 h-4 w-4" /> Edit
                </Button>
                <Button variant="ghost" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}
                  className="text-rose-300 hover:text-rose-200 hover:bg-rose-500/15">
                  {deleteMutation.isPending
                    ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    : <Trash2 className="mr-1.5 h-4 w-4" />}
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </motion.div>
  )
}