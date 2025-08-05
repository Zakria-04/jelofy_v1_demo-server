export const mealTemplates: Record<
  string,
  { name: string; description: string; price: number }[]
> = {
  default: [
    {
      name: "Cheeseburger",
      description: "A classic cheeseburger with lettuce and tomato",
      price: 5.99,
    },
    {
      name: "Pasta Carbonara",
      description: "Pasta with creamy carbonara sauce",
      price: 7.99,
    },
    {
      name: "Margherita Pizza",
      description: "Pizza with tomato sauce, mozzarella, and basil",
      price: 8.99,
    },
    {
      name: "Caesar Salad",
      description: "Fresh romaine with Caesar dressing and croutons",
      price: 6.49,
    },
    {
      name: "Grilled Chicken",
      description: "Grilled chicken breast with herbs",
      price: 9.99,
    },
    { name: "French Fries", description: "Crispy golden fries", price: 2.99 },
    {
      name: "Chocolate Cake",
      description: "Rich chocolate cake with frosting",
      price: 4.99,
    },
  ],
  vegan: [
    {
      name: "Vegan Burger",
      description: "Plant-based burger with lettuce and tomato",
      price: 6.99,
    },
    {
      name: "Vegan Pasta",
      description: "Whole wheat pasta with tomato sauce",
      price: 7.49,
    },
    {
      name: "Vegan Pizza",
      description: "Dairy-free pizza with vegan cheese",
      price: 9.49,
    },
    {
      name: "Quinoa Salad",
      description: "Quinoa with veggies and lemon dressing",
      price: 5.99,
    },
    {
      name: "Tofu Stir-fry",
      description: "Tofu with mixed vegetables",
      price: 8.99,
    },
    {
      name: "Sweet Potato Fries",
      description: "Oven-baked sweet potato fries",
      price: 3.49,
    },
    {
      name: "Fruit Salad",
      description: "Fresh mix of seasonal fruits",
      price: 4.99,
    },
  ],
};
