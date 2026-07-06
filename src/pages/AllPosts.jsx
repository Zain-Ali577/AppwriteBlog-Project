import React, {useState, useEffect} from 'react'
import appwriteService from '../appwrite/config'
import { Container, PostCard } from '../components'
import { useSelector } from 'react-redux'

function AllPosts() {
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
                console.log('AllPosts getPosts response:', response)
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
    <div className='w-full py-8'>
      <Container>
        <div className='flex flex-wrap'>
          {loading ? (
            <div className='w-full text-center py-20'>
              <p className='text-base text-slate-500'>Loading posts...</p>
            </div>
          ) : error ? (
            <div className='w-full text-center py-20'>
              <p className='text-base text-red-500'>Error: {error}</p>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
                <div key={post.$id} className='w-full md:w-1/2 lg:w-1/3 p-4'>
                    <PostCard {...post} />
                </div>
            ))
          ) : (
            <div className='w-full text-center py-20'>
              <h2 className='text-xl font-semibold'>No posts found</h2>
              <p className='mt-2 text-sm text-slate-500'>Try adding a post or check your Appwrite collection configuration.</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}

export default AllPosts
