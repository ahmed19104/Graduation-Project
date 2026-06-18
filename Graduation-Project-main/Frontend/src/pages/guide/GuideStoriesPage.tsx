import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, Heart, Eye, Plus, Trash2 } from 'lucide-react'
import { storiesApi } from '@/api/stories'
import { Button, Card, EmptyState, ListSkeleton, Modal, Input, Textarea } from '@/components/ui'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import { getErrorMessage } from '@/api/axios'
import { formatRelativeTime } from '@/utils/format'
import { absoluteMediaUrl } from '@/utils/media'
import type { Story } from '@/types'

export function GuideStoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [storyForm, setStoryForm] = useState({ city: '', description: '' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()
  const { user } = useAuth()

  const loadStories = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await storiesApi.getActiveStories()
      const myStories = user?.id ? data.filter((s) => s.userId === user.id) : []
      setStories(myStories)
    } catch (err) {
      showToast(getErrorMessage(err), 'error')
    } finally {
      setIsLoading(false)
    }
  }, [showToast, user?.id])

  useEffect(() => { loadStories() }, [loadStories])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { setSelectedFile(file); setShowModal(true) }
    e.target.value = ''
  }

  const handleCreateStory = async () => {
    if (!selectedFile) { showToast('Please select a media file.', 'error'); return }
    if (!storyForm.city.trim()) { showToast('City is required.', 'error'); return }
    if (!storyForm.description.trim()) { showToast('Description is required.', 'error'); return }

    setIsUploading(true)
    try {
      await storiesApi.createStory({
        city: storyForm.city,
        description: storyForm.description,
        mediaFile: selectedFile,
      })
      showToast('Story published.', 'success')
      setShowModal(false)
      setStoryForm({ city: '', description: '' })
      setSelectedFile(null)
      loadStories()
    } catch (err) {
      showToast(getErrorMessage(err), 'error')
    } finally { setIsUploading(false) }
  }

  const handleDelete = async (storyId: string) => {
    if (!confirm('Delete this story permanently?')) return
    try {
      await storiesApi.deleteOwn(storyId)
      setStories((prev) => prev.filter((s) => s.storyId !== storyId))
      showToast('Story deleted.', 'success')
    } catch (err) {
      showToast(getErrorMessage(err), 'error')
    }
  }

  const isVideo = (url: string) => /\.(mp4|mov|webm|mkv)$/i.test(url)

  return (
    <div className="container-app py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Stories</h1>
        <Button onClick={() => fileRef.current?.click()} isLoading={isUploading}>
          <Plus className="h-4 w-4" />
          New Story
        </Button>
        <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />
      </div>

      {isLoading ? (
        <ListSkeleton count={3} />
      ) : stories.length === 0 ? (
        <EmptyState
          icon={Camera}
          title="No stories yet"
          description="Share your travel experiences with travelers."
          actionLabel="Add a story"
          onAction={() => fileRef.current?.click()}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {stories.map((story) => {
            const fullUrl = absoluteMediaUrl(story.mediaUrl) ?? ''
            return (
              <Card key={story.storyId} className="group relative overflow-hidden" padding="none">
                <div className="relative aspect-[9/16]">
                  {isVideo(story.mediaUrl) ? (
                    <video src={fullUrl} className="h-full w-full object-cover" />
                  ) : (
                    <img src={fullUrl} alt={story.description} className="h-full w-full object-cover" loading="lazy" />
                  )}
                  <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-3 text-white">
                    <span className="inline-flex items-center gap-2 text-xs">
                      <Eye className="h-4 w-4" />{story.viewsCount}
                      <Heart className="ml-2 h-4 w-4" />{story.lovesCount}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(story.storyId)}
                    className="absolute right-2 top-2 rounded-full bg-rose-500/90 p-1.5 text-white opacity-0 transition-opacity hover:bg-rose-500 group-hover:opacity-100"
                    aria-label="Delete story"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-2">
                  <p className="truncate text-xs font-medium">{story.city}</p>
                  <p className="text-xs text-muted">{formatRelativeTime(story.createdAt)}</p>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedFile(null); setStoryForm({ city: '', description: '' }) }}
        title="Create new story"
      >
        <div className="space-y-4">
          {selectedFile && (
            <div className="overflow-hidden rounded-xl bg-slate-100 p-2 dark:bg-night-800">
              {selectedFile.type.startsWith('video/') ? (
                <video src={URL.createObjectURL(selectedFile)} className="max-h-48 w-full rounded object-cover" controls />
              ) : (
                <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="max-h-48 w-full rounded object-cover" />
              )}
            </div>
          )}

          <Input
            label="City"
            value={storyForm.city}
            onChange={(e) => setStoryForm({ ...storyForm, city: e.target.value })}
            placeholder="e.g., Luxor, Cairo, Aswan"
            required
          />
          <Textarea
            label="Description"
            value={storyForm.description}
            onChange={(e) => setStoryForm({ ...storyForm, description: e.target.value })}
            placeholder="Share what's happening…"
            rows={3}
            maxLength={300}
            required
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleCreateStory} isLoading={isUploading}>Publish Story</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
