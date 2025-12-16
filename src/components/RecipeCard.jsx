import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useRecipe } from '../context/RecipeContext';


function RecipeCard({ recipe, index = 0 }) {
  const { toggleFavorite, isFavorite } = useRecipe();
  const favorite = isFavorite(recipe.id);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(recipe.id);
  };




  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow relative"
    >
      <Link
        to={`/recipe/${recipe.id}`}
        className="block"
      >
        {recipe.image && (
          <div className="relative">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <button
              onClick={handleHeartClick}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-md z-10"
              aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`h-5 w-5 transition-colors ${favorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                  }`}
              />
            </button>
          </div>
        )}
        <div className="p-5 flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
            {recipe.title}
          </h3>
          {recipe.cardDescription || recipe.shortDescription ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {recipe.cardDescription || recipe.shortDescription}
            </p>
          ) : null}
          <div className="mt-2">
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
              View details →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>

  );
}

export default RecipeCard;


