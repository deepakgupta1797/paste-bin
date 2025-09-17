import React from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { useSelector } from 'react-redux';
import { FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';
import BackButton from '../components/BackButton';

const ViewBlogPostPage = () => {
  const { id } = useParams(); 
  const allBlogs = useSelector((state) => state.blog.blogs); 
  const blogPost = allBlogs.find((b) => b._id === id);

  const handleCopyContent = async () => {
    if (!blogPost || !blogPost.content) {
      toast.error('No content to copy.');
      return;
    }
    try {
      await navigator.clipboard.writeText(blogPost.content);
      toast.success('Content copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy content.');
    }
  };

  if (!blogPost) {
    return (
      <div className="p-6 md:p-8 text-center bg-white rounded-lg shadow-xl max-w-lg mx-auto">
        <BackButton />
        <h2 className="text-2xl font-semibold text-red-600 mb-3">Blog Post Not Found</h2>
        <p className="text-gray-600">The blog post you are looking for does not exist or may have been deleted.</p>
        <Link to="/blogs" className="mt-6 inline-block px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          Back to All Blog Posts
        </Link>
      </div>
    );
  }

  return (
  <article className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto border border-gray-200 dark:border-gray-700">
      <BackButton />
  <header className="mb-8 border-b pb-4 border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 dark:text-indigo-400 mb-3">
          {blogPost.title || 'Untitled Blog Post'}
        </h1>
  <p className="text-sm text-gray-500 dark:text-gray-300">
          Published on: {new Date(blogPost.createdAt).toLocaleDateString()}
          {blogPost.userId && <span className="ml-2">by UserID: {blogPost.userId.slice(0,6)}...</span>}
          {blogPost.updatedAt && blogPost.updatedAt !== blogPost.createdAt && <span className="ml-2 italic">(Last updated: {new Date(blogPost.updatedAt).toLocaleDateString()})</span>}
        </p>
      </header>

      {blogPost.tags && blogPost.tags.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-md font-semibold text-indigo-700 dark:text-indigo-400">
            Tags:
            </span>
          {blogPost.tags.map(tag => (
            <span key={tag} 
            className="text-sm bg-indigo-100 dark:bg-gray-800 text-indigo-700 dark:text-gray-200 px-3 py-1 rounded-full shadow-sm">
              {tag}
              </span>
          ))}
        </div>
      )}
      
      
  <div className="prose prose-indigo lg:prose-xl max-w-none mb-8 dark:prose-invert"
   dangerouslySetInnerHTML={{ __html: blogPost.content.replace(/\n/g, '<br />') }} />
      
      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
          onClick={handleCopyContent}
           className="px-4 py-2 bg-green-500 text-white rounded-md
            hover:bg-green-600 focus:outline-none focus:ring-2 
            focus:ring-green-500 focus:ring-opacity-50 flex items-center gap-1">
            <FiCopy /> Copy Content
          </button>
      </div>
    </article>
  );
};

export default ViewBlogPostPage;