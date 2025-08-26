import type { BlogApiParams, BlogApiResponse, BlogPost, WordPressPost } from "../types/blog";

// services/blogService.ts
class BlogService {
    private baseUrl = 'https://public-api.wordpress.com/wp/v2/sites/clinpharmanews.wordpress.com';
    private authorsCache = new Map<number, string>();
    private categoriesCache = new Map<number, string>();
    private isApiAvailable = true;
  
    // Tính toán thời gian đọc dựa trên số từ
    private calculateReadTime(content: string): string {
      const wordsPerMinute = 200;
      const text = content.replace(/<[^>]*>/g, '');
      const words = text.trim().split(/\s+/).length;
      const minutes = Math.ceil(words / wordsPerMinute);
      return `${minutes} min read`;
    }
  
    // Format ngày tháng
    private formatDate(dateString: string): string {
      try {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
      } catch (error) {
        return 'Unknown Date';
      }
    }
  
    // Lấy tên tác giả với error handling tốt hơn
    private async getAuthorName(authorId: number): Promise<string> {
      if (this.authorsCache.has(authorId)) {
        return this.authorsCache.get(authorId)!;
      }
  
      try {
        const response = await fetch(`${this.baseUrl}/users/${authorId}`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (response.ok) {
          const author = await response.json();
          const authorName = author.name || author.display_name || 'Unknown Author';
          this.authorsCache.set(authorId, authorName);
          return authorName;
        } else if (response.status === 401) {
          console.warn('API authentication failed, using fallback author name');
          this.isApiAvailable = false;
        }
      } catch (error) {
        console.error('Error fetching author:', error);
      }
  
      const fallbackName = 'Admin';
      this.authorsCache.set(authorId, fallbackName);
      return fallbackName;
    }
  
    // Transform WordPress post với error handling
    private async transformPost(wpPost: WordPressPost): Promise<BlogPost> {
      const authorName = await this.getAuthorName(wpPost.author);
      
      return {
        id: wpPost.id,
        title: wpPost.title?.rendered || 'Untitled Post',
        subtitle: this.cleanHtml(wpPost.excerpt?.rendered || '').substring(0, 150) + '...',
        content: wpPost.content?.rendered || '',
        excerpt: wpPost.excerpt?.rendered || '',
        image: wpPost.jetpack_featured_media_url || 
               'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop',
        author: authorName,
        date: this.formatDate(wpPost.date),
        readTime: this.calculateReadTime(wpPost.content?.rendered || ''),
        views: Math.floor(Math.random() * 2000) + 100,
        likes: Math.floor(Math.random() * 50) + 1,
        isLiked: false,
        slug: wpPost.slug,
        link: wpPost.link,
        categories: wpPost.categories || [],
        tags: wpPost.tags || []
      };
    }
  
    // Helper để clean HTML
    private cleanHtml(html: string): string {
      return html.replace(/<[^>]*>/g, '').trim();
    }
  
    // Tạo mock data khi API không khả dụng
    private getMockPosts(limit: number = 6): BlogPost[] {
      return Array.from({ length: Math.min(limit, 6) }, (_, index) => ({
        id: index + 1,
        title: `Sample Blog Post ${index + 1}`,
        subtitle: 'This is a sample blog post subtitle that demonstrates the layout and structure.',
        content: '<p>This is sample content for the blog post.</p>',
        excerpt: 'This is a sample blog post subtitle that demonstrates the layout and structure.',
        image: `https://png.pngtree.com/thumb_back/fh260/background/20240403/pngtree-assorted-pharmaceutical-medicine-pills-tablets-and-capsules-over-blue-background-image_15647957.jpg`,
        author: 'Admin',
        date: this.formatDate(new Date().toISOString()),
        readTime: '3 min read',
        views: Math.floor(Math.random() * 1000) + 100,
        likes: Math.floor(Math.random() * 50) + 1,
        isLiked: false,
        slug: `sample-post-${index + 1}`,
        link: '#',
        categories: [],
        tags: []
      }));
    }
  
    // Lấy danh sách bài viết với fallback
    async getPosts(params: BlogApiParams = {}): Promise<BlogApiResponse> {
      try {
        const searchParams = new URLSearchParams();
        
        // Thêm các tham số vào URL
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.per_page) searchParams.append('per_page', params.per_page.toString());
        if (params.search) searchParams.append('search', params.search);
        if (params.categories?.length) searchParams.append('categories', params.categories.join(','));
        if (params.tags?.length) searchParams.append('tags', params.tags.join(','));
        if (params.author) searchParams.append('author', params.author.toString());
        if (params.orderby) searchParams.append('orderby', params.orderby);
        if (params.order) searchParams.append('order', params.order);
  
        const url = `${this.baseUrl}/posts?${searchParams.toString()}`;
        
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
          },
        });
  
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            console.warn('API access denied, falling back to mock data');
            this.isApiAvailable = false;
            const mockPosts = this.getMockPosts(params.per_page || 6);
            return {
              posts: mockPosts,
              total: mockPosts.length,
              totalPages: 1
            };
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const wpPosts: WordPressPost[] = await response.json();
        
        // Transform posts với error handling
        const transformedPosts: BlogPost[] = [];
        for (const post of wpPosts) {
          try {
            const transformedPost = await this.transformPost(post);
            transformedPosts.push(transformedPost);
          } catch (error) {
            console.error('Error transforming post:', error);
            // Skip lỗi post này và tiếp tục
          }
        }
  
        // Lấy thông tin từ headers
        const total = parseInt(response.headers.get('X-WP-Total') || transformedPosts.length.toString());
        const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
  
        return {
          posts: transformedPosts,
          total,
          totalPages
        };
      } catch (error) {
        console.error('Error fetching posts:', error);
        
        // Fallback to mock data
        const mockPosts = this.getMockPosts(params.per_page || 6);
        return {
          posts: mockPosts,
          total: mockPosts.length,
          totalPages: 1
        };
      }
    }
  
    // Lấy một bài viết theo ID với fallback
    async getPostById(id: number): Promise<BlogPost | null> {
      try {
        const response = await fetch(`${this.baseUrl}/posts/${id}`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          if (response.status === 404) return null;
          if (response.status === 401 || response.status === 403) {
            console.warn('API access denied for single post');
            return null;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const wpPost: WordPressPost = await response.json();
        return await this.transformPost(wpPost);
      } catch (error) {
        console.error('Error fetching post by ID:', error);
        return null;
      }
    }
  
    // Lấy bài viết theo slug với fallback
    async getPostBySlug(slug: string): Promise<BlogPost | null> {
      try {
        const response = await fetch(`${this.baseUrl}/posts?slug=${slug}`, {
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            console.warn('API access denied for post by slug');
            return null;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const wpPosts: WordPressPost[] = await response.json();
        
        if (wpPosts.length === 0) return null;
        
        return await this.transformPost(wpPosts[0]);
      } catch (error) {
        console.error('Error fetching post by slug:', error);
        return null;
      }
    }
  
    // Lấy danh mục với fallback
    async getCategories(): Promise<{ id: number; name: string; slug: string }[]> {
      try {
        const response = await fetch(`${this.baseUrl}/categories`, {
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            console.warn('API access denied for categories');
            return this.getMockCategories();
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const categories = await response.json();
        return categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug
        }));
      } catch (error) {
        console.error('Error fetching categories:', error);
        return this.getMockCategories();
      }
    }
  
    // Mock categories
    private getMockCategories(): { id: number; name: string; slug: string }[] {
      return [
        { id: 1, name: 'Technology', slug: 'technology' },
        { id: 2, name: 'Health', slug: 'health' },
        { id: 3, name: 'Science', slug: 'science' },
        { id: 4, name: 'News', slug: 'news' }
      ];
    }
  
    // Tìm kiếm bài viết
    async searchPosts(query: string, page = 1, perPage = 10): Promise<BlogApiResponse> {
      return this.getPosts({
        search: query,
        page,
        per_page: perPage,
        orderby: 'date',
        order: 'desc'
      });
    }
  
    // Check API availability
    isAvailable(): boolean {
      return this.isApiAvailable;
    }
  }
  
  export const blogService = new BlogService();