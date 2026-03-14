import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Leaf, Sparkles, Star, ChevronLeft, ChevronRight,
  Shield, Award, Droplets, Zap,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts, getTestimonials } from '../lib/api';
import { Product, Testimonial } from '../types';

const Home: React.FC = () => {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    getProducts().then((data) => setFeaturedProducts(data.filter((p) => p.featured)));
    getTestimonials().then(setTestimonials);
  }, []);

  const prev = () => setTestimonialIndex((i) => (i === 0 ? (testimonials.length || 1) - 1 : i - 1));
  const next = () => setTestimonialIndex((i) => (i === (testimonials.length || 1) - 1 ? 0 : i + 1));

  return (
    <div className="overflow-x-hidden">

      {/* ─────────────────────────────────────── HERO */}
      <section className="relative min-h-screen flex items-center bg-[#0C0A0E] overflow-hidden pt-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(244,63,110,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(245,158,11,0.08),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-16 lg:py-24">

            {/* Left — copy */}
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 border border-rose-500/30 bg-rose-500/5 text-rose-400 text-xs font-medium tracking-[0.12em] uppercase px-4 py-2 rounded-full mb-6 lg:mb-8">
                <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" />
                100% Natural · Vitamin E Rich · African Heritage
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light leading-[0.95] text-white mb-5 lg:mb-6">
                Pure Nature.
                <br />
                <span className="italic text-shimmer">Radiant</span>
                <br />
                <span className="font-semibold">Hair.</span>
              </h1>

              <p className="text-gray-400 text-base lg:text-lg leading-relaxed mb-8 lg:mb-10 max-w-md font-light">
                Vee Locs Organic blends rare African oils and botanical actives into a luxury hair treatment your strands will thank you for.
              </p>

              <div className="flex flex-wrap gap-3 lg:gap-4">
                <Link to="/shop"
                  className="btn-primary group flex items-center gap-2 lg:gap-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm tracking-wide px-6 lg:px-8 py-3.5 lg:py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(244,63,110,0.4)]">
                  Shop the Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/track-order"
                  className="flex items-center gap-2 border border-white/20 text-white/80 hover:text-white hover:border-white/40 font-medium text-sm tracking-wide px-6 lg:px-8 py-3.5 lg:py-4 rounded-full transition-all duration-300">
                  Track My Order
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-6 lg:gap-8 mt-10 lg:mt-14 pt-8 lg:pt-10 border-t border-white/10">
                {[
                  { value: '500+', label: 'Happy Clients' },
                  { value: '100%', label: 'Natural Ingredients' },
                  { value: '4.9★', label: 'Average Rating' },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <div className="font-display text-2xl lg:text-3xl font-semibold text-white">{value}</div>
                    <div className="text-[10px] lg:text-xs text-gray-500 mt-1 tracking-wide">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — bottle */}
            <div className="relative flex items-center justify-center animate-fade-up delay-200">
              <div className="absolute w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-rose-500/20 blur-3xl" />
              <div className="absolute w-48 h-48 lg:w-60 lg:h-60 rounded-full bg-amber-400/15 blur-2xl translate-x-8" />
              <div className="relative z-10 animate-float">
                <img src="/oil.png" alt="Vee Locs Organic Hair Oil"
                  className="w-56 sm:w-64 lg:w-80 xl:w-96 object-contain drop-shadow-2xl" />
              </div>
              {/* Floating badges */}
              <div className="absolute top-4 right-2 lg:-right-4 glass rounded-2xl p-3 flex items-center gap-2 shadow-2xl animate-fade-up delay-400">
                <Award className="w-4 h-4 lg:w-5 lg:h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-900">Premium Quality</p>
                  <p className="text-[10px] text-gray-500">Dermatologist Tested</p>
                </div>
              </div>
              <div className="absolute bottom-8 left-0 lg:-left-6 glass rounded-2xl p-3 flex items-center gap-2 shadow-2xl animate-fade-up delay-500">
                <Leaf className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-900">Zero Chemicals</p>
                  <p className="text-[10px] text-gray-500">Paraben & Sulfate Free</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ─────────────────────────────────────── BENEFITS STRIP */}
      <section className="bg-white border-y border-gray-100 py-5 sm:py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />, label: '100% Natural Formula' },
              { icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />, label: 'Vitamin E Enriched' },
              { icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />, label: 'Visible in 4 Weeks' },
              { icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />, label: 'Dermatologist Approved' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────── STORY / PHILOSOPHY */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-br from-rose-50 to-amber-50">
                <img src="/oil.png" alt="Vee Locs Hair Oil" className="w-full h-full object-contain p-6 lg:p-8" />
              </div>
              <div className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 w-36 h-36 lg:w-48 lg:h-48 bg-rose-50 rounded-3xl -z-10" />
              <div className="absolute -top-4 -left-4 lg:-top-6 lg:-left-6 w-24 h-24 lg:w-32 lg:h-32 bg-amber-50 rounded-3xl -z-10" />
              <div className="absolute bottom-6 -right-3 lg:-right-10 bg-[#0C0A0E] text-white rounded-2xl p-4 lg:p-5 shadow-2xl">
                <div className="font-display text-2xl lg:text-3xl font-semibold text-rose-400">8+</div>
                <div className="text-xs text-gray-400 mt-1 max-w-[90px] lg:max-w-[100px] leading-tight">Premium natural oils per bottle</div>
              </div>
            </div>

            {/* Text */}
            <div className="lg:pl-4">
              <div className="divider-gold mb-5" />
              <span className="text-xs text-amber-600 font-semibold tracking-[0.2em] uppercase">Our Story</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mt-3 mb-5 leading-tight">
                Born from a love of <em>natural hair</em>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4 lg:mb-5 text-sm lg:text-base">
                Vee Locs Organic was created by a woman who struggled to find hair care that truly worked for afro-textured hair — without harsh chemicals, without compromise. Every bottle contains the wisdom of generations of African beauty rituals, refined into a modern luxury formula.
              </p>
              <p className="text-gray-500 leading-relaxed mb-7 lg:mb-9 text-sm lg:text-base">
                Each ingredient is ethically sourced, each batch carefully crafted. Because your hair deserves nothing less than the best nature has to offer.
              </p>
              <div className="grid grid-cols-2 gap-4 lg:gap-5 mb-7 lg:mb-9">
                {[
                  { num: 'Ethically', sub: 'Sourced Ingredients' },
                  { num: 'Cruelty', sub: 'Free & Vegan' },
                  { num: 'Handcrafted', sub: 'Small Batches' },
                  { num: 'No Harsh', sub: 'Chemicals Added' },
                ].map(({ num, sub }) => (
                  <div key={num} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-2 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{num}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/shop" className="inline-flex items-center gap-2 text-rose-600 font-semibold text-sm hover:text-rose-700 group">
                Explore All Products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────── FEATURED PRODUCTS */}
      <section className="py-16 sm:py-20 lg:py-28 bg-[#FDFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 lg:mb-14">
            <div>
              <div className="divider-gold mb-4" />
              <span className="text-xs text-amber-600 font-semibold tracking-[0.2em] uppercase">Best Sellers</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mt-2">
                Featured Collection
              </h2>
            </div>
            <Link to="/shop"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-rose-600 transition-colors group shrink-0">
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────── HOW TO USE */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="divider-gold" />
          </div>
          <span className="text-xs text-amber-600 font-semibold tracking-[0.2em] uppercase">Simple Ritual</span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mt-3 mb-12 lg:mb-16">
            How to Use
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { step: '01', icon: <Droplets className="w-6 h-6 sm:w-7 sm:h-7 text-rose-500" />, title: 'Apply', desc: 'Pour a few drops into your palm. A little goes a long way with our concentrated formula.' },
              { step: '02', icon: <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500" />, title: 'Massage', desc: 'Gently work from roots to tips. Focus on the scalp for growth or just the ends for shine.' },
              { step: '03', icon: <Star className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-500" />, title: 'Enjoy', desc: 'Leave in without rinsing. Style as usual and let the natural oils work their magic.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="relative text-center">
                <div className="font-display text-[64px] sm:text-[80px] leading-none font-semibold text-gray-100 select-none mb-3">
                  {step}
                </div>
                <div className="-mt-8 sm:-mt-10 mb-4 flex justify-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-50 rounded-2xl flex items-center justify-center shadow-sm">
                    {icon}
                  </div>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-medium text-gray-900 mb-2.5">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────── GALLERY */}
      {/*<section className="py-6 sm:py-8 bg-[#0C0A0E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            {[
              { src: '/oil.png', label: 'Original Formula' },
              { src: '/oil.png', label: 'Growth Blend' },
              { src: '/oil.png', label: 'Scalp Treatment' },
              { src: '/oil.png', label: 'Complete Trio' },
            ].map(({ src, label }, i) => (
              <div key={i} className="relative group overflow-hidden rounded-xl sm:rounded-2xl aspect-[3/4] bg-gray-900">
                <img src={src} alt={label}
                  className="w-full h-full object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 sm:p-4">
                  <p className="text-white text-xs sm:text-sm font-medium">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* ─────────────────────────────────────── TESTIMONIALS */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="divider-gold" />
          </div>
          <span className="text-xs text-amber-600 font-semibold tracking-[0.2em] uppercase">Client Stories</span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mt-3 mb-10 lg:mb-14">
            Real Results
          </h2>

          <div className="relative bg-gradient-to-br from-[#0C0A0E] to-[#1a1025] rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-14 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 lg:w-64 lg:h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 lg:w-48 lg:h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              {testimonials.length > 0 ? (
              <>
                <div className="flex justify-center gap-1 mb-5 sm:mb-8">
                  {Array.from({ length: testimonials[testimonialIndex]?.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="font-display text-xl sm:text-2xl lg:text-3xl font-light text-white leading-relaxed mb-6 sm:mb-8 italic">
                  "{testimonials[testimonialIndex]?.comment}"
                </blockquote>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-0.5 bg-rose-500 rounded mb-2.5" />
                  <p className="text-white font-semibold text-sm tracking-wide">{testimonials[testimonialIndex]?.name}</p>
                  <p className="text-gray-500 text-xs tracking-widest uppercase">{testimonials[testimonialIndex]?.location}</p>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm">Loading reviews...</p>
            )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-5 mt-7">
            <button onClick={prev} className="w-10 h-10 sm:w-11 sm:h-11 border border-gray-200 hover:border-rose-400 rounded-full flex items-center justify-center text-gray-600 hover:text-rose-500 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIndex(i)}
                  className={`rounded-full transition-all duration-300 ${i === testimonialIndex ? 'w-7 h-2 bg-rose-500' : 'w-2 h-2 bg-gray-200 hover:bg-rose-300'}`} />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 sm:w-11 sm:h-11 border border-gray-200 hover:border-rose-400 rounded-full flex items-center justify-center text-gray-600 hover:text-rose-500 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────── CTA BANNER */}
      <section className="relative py-16 sm:py-20 lg:py-28 bg-gradient-to-br from-[#0C0A0E] via-[#1a0a14] to-[#0C0A0E] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 lg:w-96 lg:h-96 bg-rose-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 lg:w-64 lg:h-64 bg-amber-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="divider-gold" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-light text-white leading-tight mb-5 lg:mb-6">
            Ready to transform <br /><em className="text-rose-400">your hair</em>?
          </h2>
          <p className="text-gray-400 text-base lg:text-lg mb-8 lg:mb-10 font-light leading-relaxed max-w-xl mx-auto">
            Join hundreds of women who have already discovered the Vee Locs natural hair ritual.
          </p>
          <Link to="/shop"
            className="btn-primary inline-flex items-center gap-2 lg:gap-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm lg:text-base px-8 lg:px-10 py-4 lg:py-5 rounded-full transition-all duration-300 hover:shadow-[0_0_60px_rgba(244,63,110,0.4)]">
            Shop Now
            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
