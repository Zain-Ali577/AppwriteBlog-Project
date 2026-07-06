import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import appwriteService from '../appwrite/config'
import {Container, PostCard} from '../components'
import { useSelector } from 'react-redux'


function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const authStatus = useSelector((state) => state.auth.status)
    
    useEffect(() => {
        if (!authStatus) {
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        appwriteService.getPosts()
            .then((response) => {
                console.log('Home getPosts response:', response)
                if (response && response.documents) {
                    setPosts(response.documents)
                } else {
                    setPosts([])
                }
            })
            .catch((fetchError) => {
                console.error('Failed to fetch posts:', fetchError)
                setError(fetchError?.message || 'Unable to load posts')
            })
            .finally(() => setLoading(false))
    }, [authStatus])

    return (
        <div className='w-full'>
            <section className='relative overflow-hidden bg-slate-950 px-4 py-16 sm:px-6 lg:px-8'>
                <div className='absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-sky-500/20 via-slate-950/0 to-transparent blur-3xl' />
                <div className='absolute -left-12 top-20 h-40 w-40 rounded-full bg-sky-500/20 blur-2xl' />
                <div className='absolute right-8 top-24 h-28 w-28 rounded-full bg-cyan-400/15 blur-3xl' />
                <div className='absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-white/5 blur-2xl' />

                <Container>
                    <div className='relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center'>
                        <div className='space-y-6'>
                            <span className='inline-flex items-center rounded-full border border-sky-400/20 bg-sky-500/10 px-4 py-1 text-xs uppercase tracking-[0.35em] text-sky-200'>Technology Blog</span>
                            <h1 className='max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl'>Premium Appwrite blogging for modern frontend builders.</h1>
                            <p className='max-w-2xl text-base leading-8 text-slate-300 sm:text-lg'>Publish developer guides, Appwrite tutorials, and cloud architecture stories with a beautiful SaaS-grade blogging experience.</p>

                            <div className='flex flex-wrap gap-3'>
                                <Link
                                    to='/all-posts'
                                    className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-300'
                                >
                                    Explore posts
                                </Link>
                                {!authStatus && (
                                    <Link
                                        to='/login'
                                        className='inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 px-6 py-3 text-sm font-semibold text-slate-100 transition duration-200 hover:border-slate-500 hover:bg-slate-800'
                                    >
                                        Sign in to publish
                                    </Link>
                                )}
                            </div>

                            <div className='grid grid-cols-2 gap-4 sm:max-w-md sm:grid-cols-3'>
                                <div className='rounded-3xl border border-white/10 bg-white/5 p-4 text-center'>
                                    <p className='text-2xl font-semibold text-white'>100%</p>
                                    <p className='mt-1 text-xs uppercase tracking-[0.35em] text-slate-400'>SaaS style UI</p>
                                </div>
                                <div className='rounded-3xl border border-white/10 bg-white/5 p-4 text-center'>
                                    <p className='text-2xl font-semibold text-white'>Instant</p>
                                    <p className='mt-1 text-xs uppercase tracking-[0.35em] text-slate-400'>Appwrite sync</p>
                                </div>
                                <div className='rounded-3xl border border-white/10 bg-white/5 p-4 text-center'>
                                    <p className='text-2xl font-semibold text-white'>Responsive</p>
                                    <p className='mt-1 text-xs uppercase tracking-[0.35em] text-slate-400'>Mobile ready</p>
                                </div>
                            </div>
                        </div>

                        <div className='relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40'>
                            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.25),_transparent_45%)]' />
                            <div className='relative space-y-6'>
                                <div className='rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-6 shadow-inner shadow-slate-950/20'>
                                    <p className='text-sm uppercase tracking-[0.35em] text-sky-300'>Latest feature</p>
                                    <h2 className='mt-3 text-2xl font-semibold text-white'>Write once, publish instantly.</h2>
                                    <p className='mt-3 text-sm leading-6 text-slate-400'>Your Appwrite backend, rich editor, and lightweight blog UI all come together in one seamless publishing workflow.</p>
                                </div>
                                <div className='grid gap-4 sm:grid-cols-2'>
                                    <div className='rounded-3xl border border-white/10 bg-slate-950/95 p-4'>
                                        <p className='text-sm text-slate-400'>Author</p>
                                        <p className='mt-2 font-semibold text-white'>Appwrite Creator</p>
                                    </div>
                                    <div className='rounded-3xl border border-white/10 bg-slate-950/95 p-4'>
                                        <p className='text-sm text-slate-400'>Data sync</p>
                                        <p className='mt-2 font-semibold text-white'>Real-time & secure</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            <div className='w-full py-8'>
                <Container>
                    {loading ? (
                        <div className='rounded-[2rem] border border-slate-800/70 bg-slate-900/80 p-10 text-center text-slate-300'>
                            <p className='text-base'>Loading posts...</p>
                        </div>
                    ) : error ? (
                        <div className='rounded-[2rem] border border-red-500/20 bg-red-500/5 p-10 text-center text-red-200'>
                            <p className='text-base font-medium'>Error: {error}</p>
                        </div>
                    ) : authStatus ? (
                        posts.length > 0 ? (
                            <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
                                {posts.map((post) => (
                                    <PostCard key={post.$id} {...post} />
                                ))}
                            </div>
                        ) : (
                            <div className='rounded-3xl border border-slate-700/70 bg-slate-900/80 p-10 text-center text-slate-300'>
                                <h2 className='text-3xl font-semibold text-white'>No posts available yet</h2>
                                <p className='mt-3 text-base text-slate-400'>Start writing a new technology post and share your knowledge with the community.</p>
                            </div>
                        )
                    ) : (
                        <div className='rounded-3xl border border-slate-700/70 bg-slate-900/80 p-10 text-center text-slate-300'>
                            <h2 className='text-3xl font-semibold text-white'>Welcome to 12MegaBlog</h2>
                            <p className='mt-3 text-base text-slate-400'>Log in to explore published posts and add your own technology articles about development, tools, and cloud services.</p>
                        </div>
                    )}
                </Container>
            </div>
        </div>
    )
}

export default Home