import React, { useEffect, useState } from 'react';
import BannerSlider from '../components/BannerSlider';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/SkeletonLoader';
import api from '../services/api';
import { motion } from 'framer-motion';

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [bannersRes, newArrivalsRes, categoriesRes, contentBlocksRes] = await Promise.all([
          api.get('/api/public/banners'),
          api.get('/api/public/new-arrivals'),
          api.get('/api/categories').catch(() => ({ data: { data: [] } })),
          api.get('/api/content-blocks').catch(() => ({ data: { data: [] } })),
        ]);
        setBanners(bannersRes.data.data);
        setNewArrivals(newArrivalsRes.data.data);
        setCategories(categoriesRes.data.data.filter(c => c.isActive));
        setContentBlocks(contentBlocksRes.data.data.filter(cb => cb.isActive));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Placeholder data for banners if none exist in DB for testing layout
  const displayBanners = banners.length > 0 ? banners : [
    {
      title: "PREMIUM MENSWEAR",
      subtitle: "Discover the latest collection of stylish and comfortable clothing.",
      // imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=1920",
      linkUrl: "/products"
    },
    {
      title: "SUMMER ESSENTIALS",
      subtitle: "Stay cool with our breathable fabrics.",
      imageUrl: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&q=80&w=1920",
      linkUrl: "/category/T-Shirts"
    },
    {
      title: "FORMAL COLLECTION",
      subtitle: "Elevate your look for any occasion.",
      imageUrl: "https://images.unsplash.com/photo-1594938298596-1216a3458ff6?auto=format&fit=crop&q=80&w=1920",
      linkUrl: "/category/Shirts"
    }
  ];

  // Placeholder products for layout testing if empty
  const displayProducts = newArrivals.length > 0 ? newArrivals : [
    { _id: '1', name: 'Premium Black Tee', price: 29.99, images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80'], isNewArrival: true },
    { _id: '2', name: 'Slim Fit Chinos', price: 59.99, images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80'], isNewArrival: true },
    { _id: '3', name: 'Classic Oxford Shirt', price: 49.99, images: ['https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=500&q=80'], isNewArrival: true },
    { _id: '4', name: 'Denim Jacket', price: 89.99, images: ['https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=500&q=80'], isNewArrival: true },
  ];

  const defaultCategories = [
    { name: 'T-Shirts', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80' },
    { name: 'Shirts', imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ce3?w=500&q=80' },
    { name: 'Pants', imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80' },
    { name: 'Others', imageUrl: 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=500&q=80' },
  ];
  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  const topBlock = contentBlocks.find(b => b.location === 'homepage_top');
  const middleBlock = contentBlocks.find(b => b.location === 'homepage_middle');
  const bottomBlock = contentBlocks.find(b => b.location === 'homepage_bottom');

  return (
    <div className="bg-primary min-h-screen">
      {/* Banner Slider */}
      <BannerSlider banners={displayBanners} />

      {/* Top Content Block (optional) */}
      {topBlock && (
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            {topBlock.title && <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">{topBlock.title}</h2>}
            <div className="text-gray-300 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: topBlock.content }} />
          </motion.div>
        </section>
      )}

      {/* Top Categories Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-wide uppercase">
            Shop by Category
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto mt-6"></div>
        </motion.div>

        

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((cat, index) => (
            <motion.a
              key={index}
              href={`/category/${cat.name}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="relative rounded-2xl overflow-hidden aspect-[3/4] group block"
            >
              <img
                src={cat.imageUrl || cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end justify-center p-8">
                <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-heading font-bold text-white mb-2 uppercase tracking-widest">
                    {cat.name}
                  </h3>
                  <span className="text-accent text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase tracking-wider font-semibold">
                    Explore →
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>
{middleBlock && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            {middleBlock.title && <h2 className="text-3xl font-bold text-white mb-4">{middleBlock.title}</h2>}
            <div className="text-gray-300" dangerouslySetInnerHTML={{ __html: middleBlock.content }} />
          </motion.div>
        )}
      {/* New Arrivals Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto bg-black border-t border-gray-900 rounded-3xl mb-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-4 md:px-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-heading font-bold text-white uppercase tracking-wide">
              New Arrivals
            </h2>
            <div className="w-16 h-1 bg-accent mt-4"></div>
          </motion.div>
          <motion.a
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            href="/products"
            className="hidden sm:inline-block text-gray-400 hover:text-accent transition-colors font-medium uppercase tracking-widest text-sm border-b border-transparent hover:border-accent pb-1"
          >
            View All Collection
          </motion.a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-10">
          {loading ? (
            Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
          ) : (
            displayProducts.slice(0, 4).map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          )}
        </div>

        <div className="mt-12 text-center sm:hidden">
            <a href="/products" className="inline-block bg-accent text-primary px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors uppercase tracking-widest text-sm">
                View All
            </a>
        </div>
      </section>

      {/* Bottom Content Block */}
      {bottomBlock && (
        <section className="py-16 px-4 max-w-7xl mx-auto border-t border-gray-900">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            {bottomBlock.title && <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-widest">{bottomBlock.title}</h2>}
            <div className="text-gray-400 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: bottomBlock.content }} />
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default Home;
