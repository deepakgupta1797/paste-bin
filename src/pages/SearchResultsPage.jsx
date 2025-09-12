import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '../components/Layout'; // Assuming useTheme is exported from Layout

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const { theme } = useTheme();

  const allPastes = useSelector((state) => state.paste.pastes);
  const allBlogs = useSelector((state) => state.blog.blogs);

  const { filteredPastes, filteredBlogs } = useMemo(() => {
    if (!query) {
      return { filteredPastes: [], filteredBlogs: [] };
    }

    const lowerCaseQuery = query.toLowerCase();

    const filterItems = (items) => {
      return items.filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(lowerCaseQuery);
        const contentMatch = item.content.toLowerCase().includes(lowerCaseQuery);
        const tagsMatch = item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
        return titleMatch || contentMatch || tagsMatch;
      });
    };

    return {
      filteredPastes: filterItems(allPastes),
      filteredBlogs: filterItems(allBlogs),
    };
  }, [query, allPastes, allBlogs]);

  const renderItem = (item, type) => (
    <div 
      key={item._id} 
      className={`p-4 mb-4 rounded-lg shadow-md border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
    >
      <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
        <Link to={`/${type}/${item._id}`} className="hover:underline">
          {item.title}
        </Link>
      </h3>
      <p className={`text-sm truncate ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        {item.content.substring(0, 150)}{item.content.length > 150 ? '...' : ''}
      </p>
      {item.tags && item.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {item.tags.slice(0, 5).map((tag) => (
            <span 
              key={tag} 
              className={`text-xs px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
       <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
        Type: {type.charAt(0).toUpperCase() + type.slice(1)}
      </p>
    </div>
  );

  if (!query) {
    return (
      <div className={`text-center p-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        Please enter a search query in the navbar.
      </div>
    );
  }

  const noResults = filteredPastes.length === 0 && filteredBlogs.length === 0;

  return (
    <div className={`container mx-auto px-4 py-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-6">
        Search Results for: <span className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}>{query}</span>
      </h1>

      {noResults ? (
        <p className="text-lg">No pastes or blogs found matching your query.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {filteredPastes.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mb-4">Pastes ({filteredPastes.length})</h2>
                {filteredPastes.map(paste => renderItem(paste, 'pastes'))}
              </>
            )}
            {filteredPastes.length === 0 && filteredBlogs.length > 0 && query && (
                 <p className="text-lg text-center py-4">No pastes found matching your query.</p>
            )}
          </div>
          <div>
            {filteredBlogs.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mb-4">Blogs ({filteredBlogs.length})</h2>
                {filteredBlogs.map(blog => renderItem(blog, 'blogs'))}
              </>
            )}
             {filteredBlogs.length === 0 && filteredPastes.length > 0 && query && (
                 <p className="text-lg text-center py-4">No blogs found matching your query.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;