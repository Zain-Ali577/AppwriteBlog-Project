import React, { useEffect, useRef, useState } from 'react'
import appwriteService from '../appwrite/config'
import { Link } from 'react-router-dom'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const formatDate = (value) => {
  if (!value) return 'Unknown date'
  try {
    return new Date(value).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return 'Unknown date'
  }
}

const estimateReadTime = (text = '') => {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function PostCard(props) {
  const post = props.post || props
  const { $id, title, featuredImage, content, userId, $createdAt } = post
  const imageUrl = featuredImage ? appwriteService.getFilePreview(featuredImage) : null

  const [modalOpen, setModalOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0, originX: 0, originY: 0 })
  const overlayRef = useRef(null)

  useEffect(() => {
    if (!modalOpen) {
      setZoom(1)
      setOffset({ x: 0, y: 0 })
      setDragging(false)
    }
  }, [modalOpen])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setModalOpen(false)
      }
    }

    if (modalOpen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [modalOpen])

  const handleWheel = (event) => {
    if (!modalOpen) return
    event.preventDefault()
    setZoom((current) => clamp(current - event.deltaY * 0.0015, 1, 3))
  }

  const handlePointerDown = (event) => {
    if (zoom <= 1) return
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    }
  }

  const handlePointerMove = (event) => {
    if (!dragging) return
    setOffset({
      x: dragRef.current.originX + (event.clientX - dragRef.current.startX),
      y: dragRef.current.originY + (event.clientY - dragRef.current.startY),
    })
  }

  const handlePointerUp = () => {
    setDragging(false)
  }

  const closeModal = (event) => {
    if (event.target === overlayRef.current) {
      setModalOpen(false)
    }
  }

  const handleImageClick = (event) => {
    event.preventDefault()
    setModalOpen(true)
  }

  const publishedAt = formatDate($createdAt)
  const authorName = userId ? 'Appwrite Creator' : 'Community Writer'
  const readTime = `${estimateReadTime(content)} min read`

  return (
    <>
      <Link to={`/post/${$id}`} className='group'>
        <article className='relative overflow-hidden rounded-xl border border-slate-200/70 bg-white/80 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-xl backdrop-blur-sm'>
          <div className='relative h-72 overflow-hidden bg-slate-100'>
            {imageUrl ? (
              <div
                role='button'
                tabIndex={0}
                onClick={handleImageClick}
                onKeyDown={(event) => event.key === 'Enter' && handleImageClick(event)}
                className='absolute inset-0 cursor-zoom-in outline-none transition duration-300 focus-visible:ring-2 focus-visible:ring-sky-400'
              >
                <img
                  src={imageUrl}
                  alt={title || 'Post image'}
                  className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
                />
              </div>
            ) : (
              <div className='flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 text-slate-500'>
                <div className='flex h-20 w-20 items-center justify-center rounded-3xl bg-white/90 shadow-sm'>
                  <span className='text-2xl'>🖼️</span>
                </div>
                <p className='text-sm font-semibold uppercase tracking-[0.35em]'>No image available</p>
              </div>
            )}
            <div className='pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/85 to-transparent' />
          </div>

          <div className='space-y-4 p-6'>
            <div className='flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-sky-600'>
              <span className='rounded-full bg-sky-100 px-3 py-1 text-sky-700'>Featured</span>
              <span>{publishedAt}</span>
              <span>{readTime}</span>
            </div>

            <h3 className='min-h-[4rem] text-xl font-semibold tracking-tight text-slate-950'>{title || 'Untitled post'}</h3>

            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <p className='text-sm text-slate-500'>by <span className='font-medium text-slate-900'>{authorName}</span></p>
              </div>
              <span className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600'>Read more</span>
            </div>
          </div>
        </article>
      </Link>

      {modalOpen && imageUrl && (
        <div
          ref={overlayRef}
          onClick={closeModal}
          className='fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950/90 p-4 backdrop-blur-sm'
          aria-modal='true'
          role='dialog'
        >
          <div className='relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95 shadow-2xl'>
            <div className='flex items-center justify-between gap-3 border-b border-white/10 px-6 py-4 text-sm text-slate-300'>
              <div>
                <p className='font-semibold text-white'>Preview image</p>
                <p className='text-xs text-slate-500'>Use mouse wheel or buttons to zoom. Drag to move.</p>
              </div>
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={() => setZoom((current) => clamp(current - 0.25, 1, 3))}
                  className='rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white transition hover:bg-white/10'
                >
                  −
                </button>
                <span className='min-w-[3rem] text-center text-white'>{zoom.toFixed(1)}×</span>
                <button
                  type='button'
                  onClick={() => setZoom((current) => clamp(current + 0.25, 1, 3))}
                  className='rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white transition hover:bg-white/10'
                >
                  +
                </button>
                <button
                  type='button'
                  onClick={() => setModalOpen(false)}
                  className='rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white transition hover:bg-white/10'
                  aria-label='Close preview'
                >
                  ✕
                </button>
              </div>
            </div>

            <div
              onWheel={handleWheel}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className='relative flex min-h-[55vh] items-center justify-center overflow-hidden bg-slate-900'
            >
              <img
                src={imageUrl}
                alt={title || 'Post preview'}
                draggable='false'
                onPointerDown={handlePointerDown}
                className='max-h-[80vh] max-w-full select-none object-contain transition-transform duration-200'
                style={{
                  transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
                  cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PostCard
