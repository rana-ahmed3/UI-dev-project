import React from 'react';
import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
  return (
    <article className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      )}
      <div className="p-5 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-700">
          {recipe.title}
        </h3>
        {recipe.cardDescription || recipe.shortDescription ? (
          <p className="text-sm text-gray-600">{recipe.cardDescription || recipe.shortDescription}</p>
        ) : null}
        <div className="mt-2">
          <Link
            to={`/recipe/${recipe.id}`}
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            View details →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default RecipeCard;


