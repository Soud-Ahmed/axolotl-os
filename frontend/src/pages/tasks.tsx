import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar } from '../components/ui/avatar';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/use-tasks';
import { useUsers } from '../hooks/use-users';
import { TaskStatus, TaskPriority, Task } from '../types';

interface TaskFormInput {
  title: string;
  description: string;
  priority: TaskPriority;
  assigneeId: string;
  dueDate: string;
}

const columns: { label: string; value: TaskStatus; colorClass: string }[] = [
  { label: 'To Do', value: 'todo', colorClass: 'border-t-4 border-gray-400 bg-gray-50' },
  { label: 'In Progress', value: 'in_progress', colorClass: 'border-t-4 border-blue-500 bg-blue-50/20' },
  { label: 'Review', value: 'review', colorClass: 'border-t-4 border-yellow-500 bg-yellow-50/20' },
  { label: 'Done', value: 'done', colorClass: 'border-t-4 border-green-500 bg-green-50/20' },
];

export function TasksPage() {
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: users, isLoading: usersLoading } = useUsers();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormInput>();

  const openCreateModal = () => {
    reset({
      title: '',
      description: '',
      priority: 'medium',
      assigneeId: '',
      dueDate: '',
    });
    setIsFormOpen(true);
  };

  const onSubmit = (data: TaskFormInput) => {
    const taskInput = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: 'todo' as TaskStatus,
      assigneeId: data.assigneeId || undefined,
      dueDate: data.dueDate || undefined,
    };

    createTask.mutate(taskInput, {
      onSuccess: () => {
        setIsFormOpen(false);
      }
    });
  };

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    updateTask.mutate({
      id: task.id,
      input: { status: newStatus },
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask.mutate(id, {
        onSuccess: () => {
          setSelectedTask(null);
        }
      });
    }
  };

  if (tasksLoading || usersLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Kanban Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">Track production workflows and collaborate on campaigns.</p>
        </div>
        <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </Button>
      </div>

      {/* Kanban Board columns */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 items-start">
        {columns.map((col) => {
          const colTasks = tasks?.filter((t) => t.status === col.value) || [];

          return (
            <div key={col.value} className="flex flex-col h-full min-h-[60vh]">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-sm font-bold text-gray-700">{col.label}</h3>
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xxs font-semibold text-gray-700">
                  {colTasks.length}
                </span>
              </div>

              {/* Column list wrapper */}
              <div className={`flex-1 rounded-xl p-3 space-y-4 border border-gray-200/60 shadow-sm ${col.colorClass}`}>
                {colTasks.length === 0 ? (
                  <div className="text-center text-xs text-gray-400 py-12">
                    No tasks.
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <Card
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="cursor-pointer border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 bg-white"
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{task.title}</h4>
                          <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xxs font-bold uppercase tracking-wider ${
                            task.priority === 'high'
                              ? 'bg-red-50 text-red-700'
                              : task.priority === 'medium'
                              ? 'bg-yellow-50 text-yellow-700'
                              : 'bg-green-50 text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          {/* Assignee */}
                          <div className="flex items-center gap-1.5">
                            <Avatar name={task.assignee?.fullName || task.assignee?.name} size="sm" className="bg-blue-600 text-white" />
                            <span className="text-xxs text-gray-600 max-w-24 truncate">
                              {task.assignee?.fullName || task.assignee?.name || 'Unassigned'}
                            </span>
                          </div>

                          {/* Due Date */}
                          {task.dueDate && (
                            <span className="text-xxs text-gray-400 font-mono">
                              Due: {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>

                        {/* Status Select dropdown */}
                        <div className="pt-2">
                          <select
                            onClick={(e) => e.stopPropagation()} // Prevent opening details modal
                            value={task.status}
                            onChange={(e) => handleStatusChange(task, e.target.value as TaskStatus)}
                            className="w-full text-xxs bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                          </select>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Details Side Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-900">{selectedTask.title}</h2>
              <button onClick={() => setSelectedTask(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-gray-500 block mb-1">Description</span>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border">{selectedTask.description || 'No description provided.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-gray-500 block mb-1">Priority</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                    selectedTask.priority === 'high'
                      ? 'bg-red-50 text-red-700'
                      : selectedTask.priority === 'medium'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-green-50 text-green-700'
                  }`}>
                    {selectedTask.priority}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 block mb-1">Status</span>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 capitalize">
                    {selectedTask.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-gray-500 block mb-1">Assignee</span>
                  <div className="flex items-center gap-2">
                    <Avatar name={selectedTask.assignee?.fullName || selectedTask.assignee?.name} size="sm" />
                    <span>{selectedTask.assignee?.fullName || selectedTask.assignee?.name || 'Unassigned'}</span>
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 block mb-1">Reporter</span>
                  <div className="flex items-center gap-2">
                    <Avatar name={selectedTask.reporter?.fullName || selectedTask.reporter?.name} size="sm" />
                    <span>{selectedTask.reporter?.fullName || selectedTask.reporter?.name || 'Unknown'}</span>
                  </div>
                </div>
              </div>

              {selectedTask.dueDate && (
                <div>
                  <span className="font-semibold text-gray-500 block mb-1">Due Date</span>
                  <span className="font-mono text-gray-800">{new Date(selectedTask.dueDate).toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-150">
              <Button
                onClick={() => handleDelete(selectedTask.id)}
                variant="ghost"
                className="border border-red-200 text-red-600 hover:bg-red-50 text-xs py-2 rounded-lg"
              >
                Delete Task
              </Button>
              <Button onClick={() => setSelectedTask(null)} className="bg-blue-600 text-white hover:bg-blue-700">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Create Task</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Task Title"
                placeholder="e.g. Design header banner"
                error={errors.title?.message}
                {...register('title', { required: 'Title is required' })}
              />

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700">Description</label>
                <textarea
                  className="min-h-24 rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Task details and instructions..."
                  {...register('description')}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700">Priority</label>
                <select
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  {...register('priority')}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700">Assignee</label>
                <select
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  {...register('assigneeId')}
                >
                  <option value="">Unassigned</option>
                  {users?.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName || u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Due Date"
                type="datetime-local"
                error={errors.dueDate?.message}
                {...register('dueDate')}
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-150">
                <Button variant="ghost" type="button" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  loading={createTask.isPending}
                >
                  Create Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
