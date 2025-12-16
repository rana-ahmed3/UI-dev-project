// make sure the homepage has a get started button that leads to the recipes page
jest.mock('../assets/LemonHerbRoastedChicken.png', () => 'mock-image.png');
jest.mock('../assets/MediterraneanSalad.png', () => 'mock-image.png');
jest.mock('../assets/CreamyPastaAlfredo.png', () => 'mock-image.png');
jest.mock('../assets/VeggieStir-Fry.png', () => 'mock-image.png');

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { RecipeProvider } from '../context/RecipeContext';
import Home from './Home';

test('Home page has "Get Started" button', () => { 
    render(
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <RecipeProvider>
                        <Home />
                    </RecipeProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );

   
    const getStartedButton = screen.getByRole('link', {
        name: /get started/i 
    });

    expect(getStartedButton).toBeInTheDocument();
    expect(getStartedButton).toHaveAttribute('href', '/recipes');
});