"use client";

import { Skeleton } from "@/src/components/ui/skeleton";
import TaskCard from "../comPonent/TaskCard";
import TaskForm from "../comPonent/TaskForm";
import { useQuery } from "@tanstack/react-query";
import api from "../libs/axios";
import { Task } from "../types/task";


export default function Home(){
    const {data: tasks, isLoading, isError} = useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: async () => {
            const res = await api.get('/tasks')
            return res.data.data
        }
    })

    return (
      <main className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Pager wrapper with distinct gradient (contrasts with TaskCard/TaskForm) */}
          <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-indigo-900/30 via-violet-800/20 to-cyan-700/10 border border-white/6 backdrop-blur-sm shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              <div className="md:col-span-1">
                <div className="sticky top-8">
                  <TaskForm />
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <h1 className="text-2xl font-bold text-white mb-4 tracking-tight">Your Tasks</h1>

                {isLoading && (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col space-y-3 p-4 border border-blue-900/40 rounded-xl bg-[#0A1F44]/80 shadow-sm">
                        <Skeleton className="h-6 w-[200px] rounded-md bg-blue-900/40" />
                        <Skeleton className="h-4 w-[300px] rounded-md bg-blue-900/30" />
                        <div className="flex justify-between items-center pt-2 border-t border-blue-900/40">
                          <Skeleton className="h-9 w-[120px] bg-blue-900/30" />
                          <Skeleton className="h-9 w-[70px] bg-blue-900/30" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isError && (
                  <div className="p-4 border border-rose-500/30 bg-rose-500/10 text-rose-300 rounded-xl text-center">
                    Failed to load tasks. Please make sure your backend server is running!
                  </div>
                )}

                {!isLoading && !isError && tasks?.length === 0 && (
                  <div className="p-8 border border-dashed border-blue-900/40 rounded-xl bg-[#0A1F44]/60 text-center text-blue-300/70">
                    No tasks found. Create one to get started!
                  </div>
                )}

                {!isLoading && !isError && tasks && tasks.length > 0 && (
                  <div className="grid grid-cols-1 gap-4">
                    {tasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>
    );
}