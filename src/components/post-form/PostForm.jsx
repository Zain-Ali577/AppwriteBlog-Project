import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {Button, Input, Select, RTE} from '../index'
import appwriteService from '../../appwrite/config'
import authService from '../../appwrite/auth'
import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function PostForm({ post }) {
    const {register, handleSubmit, watch, setValue, control, getValues, reset} = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.slug || '',
            content: post?.content || '',
            status: post?.status || 'active',
        }
    })

    const [notice, setNotice] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [fileKey, setFileKey] = useState(Date.now())
    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData)

    const submit = async (data) => {
        setNotice(null)
        setSubmitting(true)

        try {
            if (post) {
                const file = data.image?.[0] ? await appwriteService.uploadFile(data.image[0]) : null;

                if (file) {
                    await appwriteService.deleteFile(post.featuredImage);
                }

                const dbPost = await appwriteService.updatePost(post.$id, {
                    title: data.title,
                    slug: data.slug,
                    content: data.content,
                    status: data.status,
                    featuredImage: file ? file.$id : post.featuredImage,
                });

                if (dbPost) {
                    setNotice('Post updated successfully.')
                    setTimeout(() => navigate('/all-posts'), 1100)
                }
                return;
            }

            const file = data.image?.[0]
            if (!file) {
                setNotice('Please choose a featured image before submitting.')
                setSubmitting(false)
                return
            }

            const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif']
            const fileExtension = file.name?.split('.').pop()?.toLowerCase()
            if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
                setNotice('Invalid image extension. Allowed: png, jpg, jpeg, gif.')
                setSubmitting(false)
                return
            }

            const uploadedFile = await appwriteService.uploadFile(file)
            if (!uploadedFile) {
                setNotice('Failed to upload the image. Please try again.')
                setSubmitting(false)
                return
            }

            let resolvedUserId = userData?.$id || userData?.id;
            if (!resolvedUserId) {
                const currentUser = await authService.getCurrentUser();
                resolvedUserId = currentUser?.$id || currentUser?.id;
            }

            if (!resolvedUserId) {
                setNotice('Unable to publish post. Please log in again and try.');
                setSubmitting(false);
                return;
            }

            const slugValue = data.slug?.trim() || data.title?.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, "-").replace(/\s/g, "-");
            const postData = {
                title: data.title,
                slug: slugValue,
                content: data.content,
                status: data.status,
                featuredImage: uploadedFile.$id,
                userid: resolvedUserId,
                userId: resolvedUserId,
            }

            console.log('PostForm createPost payload:', postData)
            const dbPost = await appwriteService.createPost(postData)
            console.log('PostForm createPost response:', dbPost)

            if (dbPost) {
                setNotice('Post was added successfully.')
                reset({ title: '', slug: '', content: '', status: 'active', image: null })
                setFileKey(Date.now())
                setTimeout(() => navigate('/all-posts'), 1300)
            } else {
                setNotice('Failed to create post. Please check Appwrite settings.')
            }
        } catch (error) {
            console.error('Post submission error:', error)
            setNotice('An error occurred while saving the post. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className='w-full px-2 mb-4'>
                {notice && (
                    <div className='rounded-xl border border-slate-300/70 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm'>
                        {notice}
                    </div>
                )}
            </div>
            <div className='w-full px-2 mb-6'>
                <div className='rounded-3xl border border-slate-200/80 bg-slate-50 p-5 text-slate-700 shadow-sm'>
                    <h2 className='text-xl font-semibold mb-2'>Write a technology blog post</h2>
                    <p className='text-sm leading-6 text-slate-600'>Share a developer guide, Appwrite tutorial, frontend pattern, or cloud architecture story. Help readers learn with practical examples and real-world insights.</p>
                </div>
            </div>
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    key={fileKey}
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && post.featuredImage && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full" disabled={submitting}>
                    {submitting ? (post ? 'Updating...' : 'Saving...') : post ? 'Update' : 'Submit'}
                </Button>
            </div>
        </form>
    );
}
