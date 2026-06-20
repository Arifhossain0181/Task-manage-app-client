/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm, type ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { taskFormSchema, TaskFormValues } from './../libs/schemas';
import api from '../libs/axios';

import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';

export default function TaskForm() {
  const queryClient = useQueryClient();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: { title: '', description: '' },
  });

  const mutation = useMutation({
    mutationFn: async (values: TaskFormValues) => {
      const res = await api.post('/tasks', values);
      return res.data;
    },
    onMutate: () => {
      toast.loading('Creating task...')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      form.reset();
      toast.success('Task created')
    },
    onError: (err: any) => {
      toast.error(err?.message ?? 'Failed to create task')
    },
  });

  const onSubmit = (data: TaskFormValues) => mutation.mutate(data);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-xl mx-auto"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-500/25 via-indigo-500/15 to-cyan-400/20 blur-2xl opacity-60" />

      <div className="relative rounded-2xl border border-blue-900/40 bg-[#0A1F44] backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] p-7">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center gap-2 mb-6"
        >
          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Create New Task
            </h2>
            <p className="text-xs text-blue-300/60">Plan it. Track it. Crush it.</p>
          </div>
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }: { field: ControllerRenderProps<TaskFormValues, 'title'> }) => (
                  <FormItem>
                    <FormLabel className="text-blue-200 text-sm">Task Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Ship the landing page"
                        {...field}
                        className="bg-[#0F2A52] border-blue-900/50 text-white placeholder:text-blue-300/40 focus-visible:ring-blue-400/50 focus-visible:border-blue-400/50 transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-rose-400" />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22, duration: 0.4 }}
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }: { field: ControllerRenderProps<TaskFormValues, 'description'> }) => (
                  <FormItem>
                    <FormLabel className="text-blue-200 text-sm">
                      Description <span className="text-blue-300/50">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Add a few details…"
                        {...field}
                        className="bg-[#0F2A52] border-blue-900/50 text-white placeholder:text-blue-300/40 focus-visible:ring-blue-400/50 focus-visible:border-blue-400/50 transition-all duration-300 resize-none"
                      />
                    </FormControl>
                    <FormMessage className="text-rose-400" />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:via-blue-400 hover:to-cyan-400 text-white border-0 shadow-[0_10px_30px_-10px_rgba(59,130,246,0.6)] transition-all duration-300"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mutation.isPending ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding…
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Task
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </form>
        </Form>
      </div>
    </motion.div>
  );
}