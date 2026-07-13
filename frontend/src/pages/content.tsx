import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/auth';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useArticles, useCreateArticle, useUpdateArticle, useDeleteArticle } from '../hooks/use-articles';
import { Article, ArticleStatus } from '../types';

interface ArticleFormInput {
  title: string;
  content: string;
  summary: string;
  category: string;
  tagsString: string;
  status: ArticleStatus;
}

export function ContentPage() {
  const user = useAuthStore((s) => s.user);
  const { data: articles, isLoading, isError } = useArticles();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();

  const [filter, setFilter] = useState<string>('all');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [coverImageBase64, setCoverImageBase64] = useState<string>('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ArticleFormInput>();

  const openCreateModal = () => {
    setEditingArticle(null);
    setCoverImageBase64('');
    reset({
      title: '',
      content: '',
      summary: '',
      category: 'General',
      tagsString: '',
      status: 'draft',
    });
    setIsFormOpen(true);
  };

  const openEditModal = (article: Article) => {
    setEditingArticle(article);
    setCoverImageBase64(article.coverImage || '');
    reset({
      title: article.title,
      content: article.content,
      summary: article.summary || '',
      category: article.category || 'General',
      tagsString: article.tags?.join(', ') || '',
      status: article.status,
    });
    setIsFormOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ArticleFormInput) => {
    const tags = data.tagsString
      ? data.tagsString.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const articleInput = {
      title: data.title,
      content: data.content,
      summary: data.summary,
      status: data.status,
      category: data.category,
      tags,
      coverImage: coverImageBase64 || undefined,
      publishDate: data.status === 'published' ? new Date().toISOString() : undefined,
    };

    if (editingArticle) {
      updateArticle.mutate({
        id: editingArticle.id,
        input: articleInput,
      }, {
        onSuccess: () => {
          setIsFormOpen(false);
          setEditingArticle(null);
        }
      });
    } else {
      createArticle.mutate(articleInput, {
        onSuccess: () => {
          setIsFormOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <h2 className="font-semibold text-lg">Error loading articles</h2>
        <p className="text-sm mt-1">Make sure the backend server is running and accessible.</p>
      </div>
    );
  }

  const filteredArticles = articles?.filter((art) => {
    if (filter === 'all') return true;
    return art.status === filter;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Content CMS</h1>
          <p className="mt-1 text-sm text-gray-500">Create, review, and publish articles for Axolotl Web Media.</p>
        </div>
        {user?.role !== 'client' && (
          <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Write Article
          </Button>
        )}
      </div>

      {/* Filter and Content Card */}
      <Card className="shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50/50">
          <div className="flex gap-2">
            {['all', 'draft', 'review', 'scheduled', 'published'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {filteredArticles.length} items found
          </span>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 font-medium text-gray-500 uppercase text-xs tracking-wider">
                  <th className="px-6 py-3.5">Title</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Author</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Updated</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      No articles match the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900 truncate max-w-xs">
                        {article.title}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{article.category}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {article.author?.fullName || article.author?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xxs font-semibold uppercase tracking-wider ${
                          article.status === 'published'
                            ? 'bg-green-50 text-green-700'
                            : article.status === 'scheduled'
                            ? 'bg-blue-50 text-blue-700'
                            : article.status === 'review'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                        {new Date(article.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {/* Permissions check: writer can edit own; editors and admins can do any */}
                        {(user?.role === 'super_admin' || user?.role === 'admin' || article.authorId === user?.id) && (
                          <button
                            onClick={() => openEditModal(article)}
                            className="text-blue-600 hover:text-blue-900 text-xs font-semibold"
                          >
                            Edit
                          </button>
                        )}
                        {(user?.role === 'super_admin' || user?.role === 'admin') && (
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="text-red-600 hover:text-red-900 text-xs font-semibold"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Editor Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingArticle ? 'Edit Article' : 'Create Article'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Article Title"
                placeholder="Enter title"
                error={errors.title?.message}
                {...register('title', { required: 'Title is required' })}
              />

              <Input
                label="Summary"
                placeholder="Brief summary of the article"
                error={errors.summary?.message}
                {...register('summary')}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Category"
                  placeholder="e.g. Technology, Health"
                  error={errors.category?.message}
                  {...register('category')}
                />
                <Input
                  label="Tags (Comma separated)"
                  placeholder="e.g. react, web dev"
                  error={errors.tagsString?.message}
                  {...register('tagsString')}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700">Status</label>
                <select
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  {...register('status')}
                >
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  {/* Scheduled and published available to editors/admins */}
                  {(user?.role === 'super_admin' || user?.role === 'admin') && (
                    <>
                      <option value="scheduled">Scheduled</option>
                      <option value="published">Published</option>
                    </>
                  )}
                </select>
              </div>

              {/* Cover Image Selection */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700">Cover Image</label>
                <div className="flex items-center gap-4 border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50/50">
                  {coverImageBase64 ? (
                    <img src={coverImageBase64} alt="Preview" className="h-16 w-24 object-cover rounded-lg border" />
                  ) : (
                    <div className="h-16 w-24 bg-gray-100 rounded-lg border flex items-center justify-center text-gray-400 text-xxs font-semibold uppercase tracking-wider">No Image</div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700">Content (Markdown Supported)</label>
                <textarea
                  className="min-h-48 rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Write your article content here..."
                  {...register('content', { required: 'Content is required' })}
                />
                {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-150">
                <Button variant="ghost" type="button" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  loading={createArticle.isPending || updateArticle.isPending}
                >
                  Save Article
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
