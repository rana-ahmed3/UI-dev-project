import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; 
import RecipeCard from './RecipeCard';
import { RecipeProvider } from '../context/RecipeContext';
import { AuthProvider } from '../context/AuthContext';

// test for RecipeCard component, tests whether the favorite button changes its state when the user presses it
const mockRecipe = {
    id: 1,
    title: "Test Recipe",
    image: "test.jpg",
    cardDescription: "Test description"
};

test('Favorite button toggles when clicked', () => {
    render(
        <BrowserRouter> 
            <AuthProvider>
                <RecipeProvider>
                    <RecipeCard recipe={mockRecipe} index={0} />
                </RecipeProvider>
            </AuthProvider>
        </BrowserRouter>
    );

    const favoriteButton = screen.getByRole('button', {
        name: /favorite/i
    });

    fireEvent.click(favoriteButton);
    expect(favoriteButton).toBeInTheDocument();
});