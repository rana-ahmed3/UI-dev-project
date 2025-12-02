import lemonChickenImg from '../assets/LemonHerbRoastedChicken.png';
import mediterraneanSaladImg from '../assets/MediterraneanSalad.png';
import pastaAlfredoImg from '../assets/CreamyPastaAlfredo.png';
import veggieStirFryImg from '../assets/VeggieStir-Fry.png';

export const recipes = [
  {
    id: 'lemon-herb-chicken',
    title: 'Lemon Herb Roasted Chicken',
    shortDescription: "A bright and zesty roasted chicken that's simple and satisfying.",
    cardDescription: 'Bright, zesty chicken perfect for weeknights.',
    image: lemonChickenImg,
    prepTime: '15 mins',
    cookTime: '45 mins',
    servings: '4',
    ingredients: [
      '1 whole chicken (about 3.5–4 lbs)',
      '2 lemons, halved',
      '3 tbsp olive oil',
      '4 cloves garlic, minced',
      '1 tbsp fresh rosemary, chopped',
      '1 tbsp fresh thyme, chopped',
      'Salt and black pepper to taste',
    ],
    instructions: [
      'Preheat oven to 425°F (220°C). Pat the chicken dry.',
      'Whisk oil, garlic, rosemary, thyme, salt, and pepper.',
      'Rub mixture over chicken; stuff cavity with lemon halves.',
      'Roast 45–55 minutes, until juices run clear and skin is crisp.',
      'Rest 10 minutes, carve, and serve with pan juices.',
    ],
  },
  {
    id: 'mediterranean-salad',
    title: 'Mediterranean Salad',
    shortDescription: 'Crisp veggies, olives, and tangy feta.',
    image: mediterraneanSaladImg,
  },
  {
    id: 'creamy-pasta-alfredo',
    title: 'Creamy Pasta Alfredo',
    shortDescription: 'Comforting and creamy with parmesan.',
    image: pastaAlfredoImg,
  },
  {
    id: 'veggie-stir-fry',
    title: 'Veggie Stir-Fry',
    shortDescription: 'Colorful veggies with a savory sauce.',
    image: veggieStirFryImg,
  },
];


