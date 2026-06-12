import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageGalleryProps {
  images: string[]
  thumbnail: string
}

/**
 * ImageGallery Component
 * 
 * Purpose: Display product images with thumbnail navigation
 * Why it exists: Reusable image gallery for product details
 * Features: Main image display, thumbnail strip, smooth transitions, glassmorphism styling
 */
const ImageGallery = ({ images, thumbnail }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(thumbnail)
  const allImages = [thumbnail, ...images]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <motion.div
        className="relative aspect-square overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage}
            src={selectedImage}
            alt="Product image"
            className="h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>
      </motion.div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {allImages.map((image, index) => (
          <motion.button
            key={image}
            onClick={() => setSelectedImage(image)}
            className={`relative flex-shrink-0 aspect-square w-20 overflow-hidden rounded-xl border-2 transition-all ${
              selectedImage === image
                ? 'border-purple-500 scale-105'
                : 'border-white/20 hover:border-purple-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
            />
            {selectedImage === image && (
              <motion.div
                className="absolute inset-0 bg-purple-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default ImageGallery
