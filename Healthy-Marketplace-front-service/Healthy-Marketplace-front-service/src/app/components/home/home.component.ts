import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { trigger, transition, style, animate, query, stagger, keyframes } from '@angular/animations';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  video?: string;
  cta: string;
  ctaLink: string;
  secondaryCta?: string;
  secondaryCtaLink?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  hoverImage?: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  organic: boolean;
  local: boolean;
  description: string;
  seller: string;
  discount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  badge?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  count: number;
  color: string;
}

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  product: string;
  video?: string;
  verified: boolean;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  category: string;
  likes: number;
  comments: number;
}

interface Statistic {
  icon: string;
  value: number;
  label: string;
  suffix: string;
  prefix?: string;
}

interface Brand {
  name: string;
  logo: string;
  url: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.8s cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeInDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-30px)' }),
        animate('0.8s cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('0.8s cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('fadeInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('0.8s cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('0.6s cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('staggerFadeIn', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger('100ms', [
            animate('0.6s cubic-bezier(0.35, 0, 0.25, 1)', 
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('flipIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'rotateY(90deg)' }),
        animate('0.8s ease-out', 
          style({ opacity: 1, transform: 'rotateY(0)' }))
      ])
    ]),
    trigger('zoomIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.3)' }),
        animate('0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('parallaxSection') parallaxSection!: ElementRef;
  @ViewChild('counterSection') counterSection!: ElementRef;

  // State
  currentSlide = 0;
  autoplayInterval: any;
  isVideoPlaying = false;
  showVideoModal = false;
  currentVideoUrl = '';
  scrollProgress = 0;
  mousePosition = { x: 0, y: 0 };
  isVisible = {
    hero: false,
    categories: false,
    products: false,
    features: false,
    testimonials: false,
    blog: false,
    stats: false
  };
  selectedCategory = 'all';
  newsletterEmail = '';
  newsletterSubmitted = false;
  searchQuery = '';
  showSearchOverlay = false;
  cartAnimation = false;
  wishlist: number[] = [];

  // Hero Slides with Videos
  heroSlides: HeroSlide[] = [
    {
      id: 1,
      title: 'Fresh Organic',
      subtitle: 'Farm to Table',
      description: 'Discover the pure taste of nature with our farm-fresh organic produce, delivered directly from local farmers to your doorstep within 24 hours of harvest.',
      image: 'assets/hero/organic-farm.jpg',
      video: 'assets/videos/organic-farm.mp4',
      cta: 'Shop Now',
      ctaLink: '/shop',
      secondaryCta: 'Watch Video',
      secondaryCtaLink: '#video'
    },
    {
      id: 2,
      title: 'Sustainable',
      subtitle: 'Eco-Friendly Farming',
      description: 'Join us in supporting sustainable agriculture. Every purchase helps local farmers and promotes environmentally friendly farming practices.',
      image: 'assets/hero/sustainable.jpg',
      video: 'assets/videos/sustainable.mp4',
      cta: 'Learn More',
      ctaLink: '/about',
      secondaryCta: 'Our Impact',
      secondaryCtaLink: '/impact'
    },
    {
      id: 3,
      title: 'Healthy Living',
      subtitle: 'Natural Wellness',
      description: 'Transform your lifestyle with our carefully curated selection of organic products, designed to promote health, wellness, and environmental consciousness.',
      image: 'assets/hero/wellness.jpg',
      video: 'assets/videos/wellness.mp4',
      cta: 'Explore',
      ctaLink: '/shop',
      secondaryCta: 'Watch Story',
      secondaryCtaLink: '#story'
    }
  ];

  // Categories with stunning images
  categories: Category[] = [
    {
      id: 'fruits',
      name: 'Fresh Fruits',
      icon: 'fas fa-apple-alt',
      image: 'assets/categories/fruits.jpg',
      count: 48,
      color: 'from-red-400 to-orange-500'
    },
    {
      id: 'vegetables',
      name: 'Organic Vegetables',
      icon: 'fas fa-carrot',
      image: 'assets/categories/vegetables.jpg',
      count: 56,
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 'dairy',
      name: 'Dairy & Eggs',
      icon: 'fas fa-cheese',
      image: 'assets/categories/dairy.jpg',
      count: 32,
      color: 'from-yellow-400 to-amber-500'
    },
    {
      id: 'bakery',
      name: 'Fresh Bakery',
      icon: 'fas fa-bread-slice',
      image: 'assets/categories/bakery.jpg',
      count: 24,
      color: 'from-orange-400 to-red-500'
    },
    {
      id: 'beverages',
      name: 'Healthy Drinks',
      icon: 'fas fa-coffee',
      image: 'assets/categories/beverages.jpg',
      count: 28,
      color: 'from-blue-400 to-indigo-500'
    },
    {
      id: 'superfoods',
      name: 'Superfoods',
      icon: 'fas fa-seedling',
      image: 'assets/categories/superfoods.jpg',
      count: 35,
      color: 'from-purple-400 to-pink-500'
    }
  ];

  // Featured Products
  featuredProducts: Product[] = [
    {
      id: 1,
      name: 'Organic Honeycrisp Apples',
      price: 5.99,
      originalPrice: 7.99,
      unit: 'kg',
      image: 'assets/products/apples.jpg',
      hoverImage: 'assets/products/apples-hover.jpg',
      category: 'fruits',
      rating: 4.9,
      reviews: 342,
      inStock: true,
      organic: true,
      local: true,
      description: 'Crisp, juicy, and sustainably grown in local orchards',
      seller: 'Green Valley Farm',
      discount: 25,
      isNew: false,
      isFeatured: true,
      badge: 'Bestseller'
    },
    {
      id: 2,
      name: 'Organic Avocado Box',
      price: 8.99,
      originalPrice: 12.99,
      unit: 'box (6 pcs)',
      image: 'assets/products/avocados.jpg',
      hoverImage: 'assets/products/avocados-hover.jpg',
      category: 'fruits',
      rating: 4.8,
      reviews: 289,
      inStock: true,
      organic: true,
      local: false,
      description: 'Creamy, ripe avocados perfect for guacamole and toast',
      seller: 'Tropical Harvest',
      discount: 30,
      isNew: true,
      isFeatured: true,
      badge: 'New'
    },
    {
      id: 3,
      name: 'Organic Rainbow Carrots',
      price: 3.99,
      unit: 'bunch',
      image: 'assets/products/carrots.jpg',
      hoverImage: 'assets/products/carrots-hover.jpg',
      category: 'vegetables',
      rating: 4.7,
      reviews: 156,
      inStock: true,
      organic: true,
      local: true,
      description: 'Colorful heirloom carrots, rich in antioxidants',
      seller: 'Sunshine Organics',
      isNew: false,
      isFeatured: true,
      badge: 'Organic'
    },
    {
      id: 4,
      name: 'Organic Sourdough Bread',
      price: 4.49,
      unit: 'loaf',
      image: 'assets/products/sourdough.jpg',
      hoverImage: 'assets/products/sourdough-hover.jpg',
      category: 'bakery',
      rating: 4.9,
      reviews: 203,
      inStock: true,
      organic: false,
      local: true,
      description: 'Artisan sourdough, baked fresh daily with organic flour',
      seller: 'Artisan Bakery',
      isNew: false,
      isFeatured: true,
      badge: 'Fresh'
    },
    {
      id: 5,
      name: 'Organic Cold-Pressed Juice',
      price: 6.99,
      originalPrice: 8.99,
      unit: 'bottle',
      image: 'assets/products/juice.jpg',
      hoverImage: 'assets/products/juice-hover.jpg',
      category: 'beverages',
      rating: 4.6,
      reviews: 178,
      inStock: true,
      organic: true,
      local: false,
      description: 'Cold-pressed juice blend with turmeric and ginger',
      seller: 'Juice Lab',
      discount: 22,
      isNew: true,
      isFeatured: true,
      badge: 'Trending'
    },
    {
      id: 6,
      name: 'Organic Free-Range Eggs',
      price: 6.99,
      originalPrice: 8.99,
      unit: 'dozen',
      image: 'assets/products/eggs.jpg',
      hoverImage: 'assets/products/eggs-hover.jpg',
      category: 'dairy',
      rating: 4.9,
      reviews: 412,
      inStock: true,
      organic: true,
      local: true,
      description: 'Farm-fresh eggs from free-range hens',
      seller: 'Happy Hens Farm',
      discount: 22,
      isNew: false,
      isFeatured: true,
      badge: 'Bestseller'
    }
  ];

  // Video Testimonials
  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'assets/testimonials/sarah.jpg',
      rating: 5,
      text: 'The quality is absolutely amazing! I love that I can trust every product to be truly organic. The delivery is always on time and the produce stays fresh for days.',
      date: '2 days ago',
      product: 'Weekly Fruit Box',
      video: 'assets/videos/testimonials/sarah.mp4',
      verified: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'assets/testimonials/michael.jpg',
      rating: 5,
      text: 'Game changer for our family! We eat healthier now and support local farmers. The subscription service is so convenient and the seasonal recipes are a nice touch.',
      date: '1 week ago',
      product: 'Family Vegetable Box',
      verified: true
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      avatar: 'assets/testimonials/emma.jpg',
      rating: 5,
      text: 'As a chef, ingredient quality is everything. GreenMarket never disappoints. Their produce rivals what I get from farmers markets, but with the convenience of delivery.',
      date: '3 days ago',
      product: 'Chef\'s Selection',
      video: 'assets/videos/testimonials/emma.mp4',
      verified: true
    }
  ];

  // Blog Posts
  blogPosts: BlogPost[] = [
    {
      id: 1,
      title: '10 Benefits of Eating Organic',
      excerpt: 'Discover why switching to organic produce can transform your health and the environment...',
      image: 'assets/blog/organic-benefits.jpg',
      author: 'Dr. Lisa Chen',
      authorAvatar: 'assets/blog/authors/lisa.jpg',
      date: 'May 15, 2024',
      readTime: '5 min read',
      category: 'Health',
      likes: 234,
      comments: 45
    },
    {
      id: 2,
      title: 'Seasonal Eating Guide: Summer',
      excerpt: 'Make the most of summer with our guide to seasonal fruits and vegetables...',
      image: 'assets/blog/summer-guide.jpg',
      author: 'Chef Maria Santos',
      authorAvatar: 'assets/blog/authors/maria.jpg',
      date: 'May 12, 2024',
      readTime: '4 min read',
      category: 'Recipes',
      likes: 189,
      comments: 32
    },
    {
      id: 3,
      title: 'Sustainable Farming Practices',
      excerpt: 'Learn how local farmers are using innovative techniques to protect our planet...',
      image: 'assets/blog/sustainable.jpg',
      author: 'James Wilson',
      authorAvatar: 'assets/blog/authors/james.jpg',
      date: 'May 10, 2024',
      readTime: '6 min read',
      category: 'Sustainability',
      likes: 156,
      comments: 28
    }
  ];

  // Statistics with counters
  statistics: Statistic[] = [
    { icon: 'fas fa-leaf', value: 150, label: 'Local Farmers', suffix: '+' },
    { icon: 'fas fa-smile', value: 50, label: 'Happy Customers', suffix: 'K+' },
    { icon: 'fas fa-truck', value: 100, label: 'Daily Deliveries', suffix: 'K+' },
    { icon: 'fas fa-tree', value: 10, label: 'Trees Planted', suffix: 'K+' }
  ];

  // Brand Partners
  brands: Brand[] = [
    { name: 'Organic Valley', logo: 'assets/brands/organic-valley.png', url: '#' },
    { name: 'Nature\'s Path', logo: 'assets/brands/natures-path.png', url: '#' },
    { name: 'Stonyfield', logo: 'assets/brands/stonyfield.png', url: '#' },
    { name: 'Amy\'s Kitchen', logo: 'assets/brands/amys.png', url: '#' },
    { name: 'Lundberg', logo: 'assets/brands/lundberg.png', url: '#' },
    { name: 'Eden Foods', logo: 'assets/brands/eden.png', url: '#' }
  ];

  // Daily Deals
  dailyDeals = this.featuredProducts.filter(p => p.discount).slice(0, 3);

  // Features
  features = [
    {
      icon: 'fas fa-truck',
      title: 'Free Delivery',
      description: 'Free delivery on orders above $50',
      color: 'blue'
    },
    {
      icon: 'fas fa-leaf',
      title: '100% Organic',
      description: 'Certified organic products',
      color: 'green'
    },
    {
      icon: 'fas fa-clock',
      title: 'Same Day Delivery',
      description: 'Order before 10 AM',
      color: 'orange'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Quality Guarantee',
      description: '30-day money-back guarantee',
      color: 'purple'
    }
  ];
    Math = Math;
// Add this method to home.component.ts
getCategoryName(categoryId: string): string {
  const category = this.categories.find(c => c.id === categoryId);
  return category ? category.name : categoryId;
}
  constructor() { 
    // Load wishlist from storage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      this.wishlist = JSON.parse(savedWishlist);
    }
  }

  ngOnInit(): void {
    this.startAutoplay();
    this.observeSections();
    this.preloadImages();
  }

  ngAfterViewInit(): void {
    this.initParallax();
    this.initCounters();
    // this.playVideo();
  }

  ngOnDestroy(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    this.scrollProgress = (winScroll / height) * 100;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mousePosition = {
      x: (event.clientX / window.innerWidth) * 100,
      y: (event.clientY / window.innerHeight) * 100
    };
  }

  // Hero Slider Methods
  startAutoplay(): void {
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 8000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  // Video Methods
  playVideo(videoUrl: string): void {
    this.currentVideoUrl = videoUrl;
    this.showVideoModal = true;
    setTimeout(() => {
      if (this.videoPlayer) {
        this.videoPlayer.nativeElement.play();
        this.isVideoPlaying = true;
      }
    }, 100);
  }

  closeVideo(): void {
    this.showVideoModal = false;
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.pause();
      this.isVideoPlaying = false;
    }
  }

  // Parallax Effect
  initParallax(): void {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallax = this.parallaxSection?.nativeElement;
      if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    });
  }

  // Counter Animation
  initCounters(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.statistics.forEach(stat => {
            this.animateCounter(stat);
          });
        }
      });
    }, { threshold: 0.5 });

    if (this.counterSection) {
      observer.observe(this.counterSection.nativeElement);
    }
  }

  animateCounter(stat: Statistic): void {
    const element = document.getElementById(`counter-${stat.label}`);
    if (!element) return;

    let current = 0;
    const increment = stat.value / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= stat.value) {
        element.textContent = stat.value.toString();
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toString();
      }
    }, 30);
  }

  // Intersection Observer for animations
  observeSections(): void {
    const sections = ['hero', 'categories', 'products', 'features', 'testimonials', 'blog', 'stats'];
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target.id;
          this.isVisible[section as keyof typeof this.isVisible] = true;
        }
      });
    }, { threshold: 0.2 });

    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });
  }

  // Preload images for smooth loading
  preloadImages(): void {
    const images = [
      ...this.heroSlides.map(s => s.image),
      ...this.categories.map(c => c.image),
      ...this.featuredProducts.flatMap(p => [p.image, p.hoverImage].filter(Boolean))
    ];
    
    images.forEach(src => {
      const img = new Image();
      // img.src = src;
    });
  }

  // Product Methods
  addToCart(product: Product): void {
    this.cartAnimation = true;
    setTimeout(() => this.cartAnimation = false, 1000);
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    this.showNotification(`${product.name} added to cart!`);
  }

  toggleWishlist(productId: number): void {
    const index = this.wishlist.indexOf(productId);
    if (index === -1) {
      this.wishlist.push(productId);
      this.showNotification('Added to wishlist!');
    } else {
      this.wishlist.splice(index, 1);
      this.showNotification('Removed from wishlist');
    }
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  isInWishlist(productId: number): boolean {
    return this.wishlist.includes(productId);
  }

  quickView(product: Product): void {
    console.log('Quick view:', product);
    // Implement quick view modal
  }

  // Filter products by category
  getProductsByCategory(categoryId: string): Product[] {
    if (categoryId === 'all') {
      return this.featuredProducts;
    }
    return this.featuredProducts.filter(p => p.category === categoryId);
  }

  // Newsletter
  subscribeNewsletter(): void {
    if (this.newsletterEmail && this.validateEmail(this.newsletterEmail)) {
      this.newsletterSubmitted = true;
      // API call would go here
      setTimeout(() => {
        this.newsletterSubmitted = false;
        this.newsletterEmail = '';
        this.showNotification('Successfully subscribed to newsletter!');
      }, 2000);
    }
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Search
  toggleSearch(): void {
    this.showSearchOverlay = !this.showSearchOverlay;
    if (this.showSearchOverlay) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    }
  }

  // Notification
  showNotification(message: string): void {
    // Implement toast notification
    console.log(message);
  }

  // Get CSS classes based on conditions
  getSlideClass(index: number): string {
    if (index === this.currentSlide) return 'opacity-100 translate-x-0';
    if (index < this.currentSlide) return 'opacity-0 -translate-x-full';
    return 'opacity-0 translate-x-full';
  }

  // Format price
  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  // Get discount percentage
  getDiscountPercentage(original: number, current: number): number {
    return Math.round(((original - current) / original) * 100);
  }

  // Share product
  shareProduct(product: Product): void {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    }
  }
}