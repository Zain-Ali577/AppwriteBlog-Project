import conf from '../conf/conf.js';
import { Client, Databases, ID, Storage, Permission, Role } from 'appwrite';


export class Service{
    client = new Client();
    databases;
    bucket;
    constructor(){
        if (conf.appwriteUrl) {
            this.client.setEndpoint(conf.appwriteUrl);
        }

        if (conf.appwriteProjectId) {
            this.client.setProject(conf.appwriteProjectId);
        }

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            const permissions = [
                Permission.read(Role.any()),
                Permission.write(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId)),
            ];

            const payload = {
                title,
                content,
                featuredImage,
                status,
                userId,
            };

            console.log('Appwrite service :: createPost payload', payload);

            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                payload,
                permissions
            );
        } catch (error) {
            console.error("Appwrite service :: createPost :: error", error);
            throw error;
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            )
        } catch (error) {
            console.error("Appwrite service :: updatePost :: error", error);
            throw error;
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
            conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                
                
            )
            return true

        } catch (error) {
        console.log("Appwrite service :: getCurrentUser :: error", error);
        return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);   
            return false;
        }
    }
    async getPosts(queries){
        try {
            const resolvedQueries = Array.isArray(queries) ? queries : [];
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                resolvedQueries
            )
            console.log('Appwrite getPosts response:', response)
            return response
        } catch (error) {
            console.error("Appwrite service :: getPosts :: error", error);
            throw error;
        }
    }

    //file upload service

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.error("Appwrite service :: uploadFile :: error", error);
            throw error;
        }
    }
    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
        console.log("Appwrite service :: getCurrentUser :: error", error);   
        return false    
        }
    }
    getFilePreview(fileId){
        if (!fileId) {
            return null;
        }

        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
    }
}

const serice = new Service()

export default serice
