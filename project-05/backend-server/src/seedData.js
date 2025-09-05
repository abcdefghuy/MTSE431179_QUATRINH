require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/category");
const Product = require("./models/product");

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("MongoDB connected for seeding");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const seedCategories = [
  {
    name: "Electronics",
    description: "Electronic devices and gadgets",
  },
  {
    name: "Clothing",
    description: "Fashion and clothing items",
  },
  {
    name: "Books",
    description: "Books and educational materials",
  },
  {
    name: "Home & Garden",
    description: "Home decor and gardening supplies",
  },
  {
    name: "Sports",
    description: "Sports equipment and fitness gear",
  },
];

const seedProducts = [
  // Electronics (15 products)
  {
    name: "iPhone 15",
    description: "Latest iPhone model",
    price: 999,
    imageUrl: "https://example.com/iphone15.jpg",
    stock: 50,
    rating: 4.8,
    reviewCount: 1250,
  },
  {
    name: "Samsung Galaxy S24",
    description: "Android smartphone",
    price: 899,
    imageUrl: "https://example.com/galaxy-s24.jpg",
    stock: 30,
    rating: 4.7,
    reviewCount: 980,
  },
  {
    name: "MacBook Pro",
    description: "Professional laptop",
    price: 1999,
    imageUrl: "https://example.com/macbook.jpg",
    stock: 25,
    rating: 4.9,
    reviewCount: 567,
  },
  {
    name: "iPad Air",
    description: "Tablet for productivity",
    price: 599,
    imageUrl: "https://example.com/ipad-air.jpg",
    stock: 40,
    rating: 4.6,
    reviewCount: 890,
  },
  {
    name: "AirPods Pro",
    description: "Wireless earbuds",
    price: 249,
    imageUrl: "https://example.com/airpods.jpg",
    stock: 100,
    rating: 4.5,
    reviewCount: 2340,
  },
  {
    name: "Dell XPS 13",
    description: "Ultra-thin laptop",
    price: 1299,
    imageUrl: "https://example.com/dell-xps13.jpg",
    stock: 20,
    rating: 4.6,
    reviewCount: 456,
  },
  {
    name: "Sony WH-1000XM5",
    description: "Noise-canceling headphones",
    price: 399,
    imageUrl: "https://example.com/sony-headphones.jpg",
    stock: 60,
    rating: 4.7,
    reviewCount: 789,
  },
  {
    name: "Nintendo Switch OLED",
    description: "Gaming console",
    price: 349,
    imageUrl: "https://example.com/nintendo-switch.jpg",
    stock: 35,
    rating: 4.8,
    reviewCount: 1120,
  },
  {
    name: "Apple Watch Series 9",
    description: "Smartwatch",
    price: 429,
    imageUrl: "https://example.com/apple-watch.jpg",
    stock: 45,
    rating: 4.5,
    reviewCount: 678,
  },
  {
    name: 'Samsung 65" QLED TV',
    description: "4K Smart TV",
    price: 1299,
    imageUrl: "https://example.com/samsung-tv.jpg",
    stock: 15,
    rating: 4.6,
    reviewCount: 234,
  },
  {
    name: "Google Pixel 8",
    description: "Android smartphone with AI",
    price: 699,
    imageUrl: "https://example.com/pixel8.jpg",
    stock: 40,
    rating: 4.4,
    reviewCount: 523,
  },
  {
    name: "Surface Pro 9",
    description: "2-in-1 laptop tablet",
    price: 1099,
    imageUrl: "https://example.com/surface-pro9.jpg",
    stock: 28,
    rating: 4.3,
    reviewCount: 345,
  },
  {
    name: "Canon EOS R5",
    description: "Professional mirrorless camera",
    price: 3899,
    imageUrl: "https://example.com/canon-r5.jpg",
    stock: 12,
    rating: 4.9,
    reviewCount: 156,
  },
  {
    name: "Bose SoundLink",
    description: "Portable Bluetooth speaker",
    price: 149,
    imageUrl: "https://example.com/bose-speaker.jpg",
    stock: 70,
    rating: 4.4,
    reviewCount: 890,
  },
  {
    name: "LG UltraWide Monitor",
    description: "34-inch curved monitor",
    price: 499,
    imageUrl: "https://example.com/lg-monitor.jpg",
    stock: 25,
    rating: 4.7,
    reviewCount: 234,
  },

  // Clothing (12 products)
  {
    name: "Nike Air Max",
    description: "Running shoes",
    price: 120,
    imageUrl: "https://example.com/nike-air-max.jpg",
    stock: 75,
    rating: 4.4,
    reviewCount: 456,
  },
  {
    name: "Levi's Jeans",
    description: "Classic denim jeans",
    price: 80,
    imageUrl: "https://example.com/levis-jeans.jpg",
    stock: 60,
    rating: 4.3,
    reviewCount: 234,
  },
  {
    name: "Adidas T-Shirt",
    description: "Sports t-shirt",
    price: 35,
    imageUrl: "https://example.com/adidas-tshirt.jpg",
    stock: 90,
    rating: 4.2,
    reviewCount: 567,
  },
  {
    name: "Winter Jacket",
    description: "Warm winter jacket",
    price: 150,
    imageUrl: "https://example.com/winter-jacket.jpg",
    stock: 45,
    rating: 4.7,
    reviewCount: 123,
  },
  {
    name: "Converse Chuck Taylor",
    description: "Classic canvas sneakers",
    price: 65,
    imageUrl: "https://example.com/converse.jpg",
    stock: 80,
    rating: 4.3,
    reviewCount: 678,
  },
  {
    name: "H&M Dress",
    description: "Summer casual dress",
    price: 39,
    imageUrl: "https://example.com/hm-dress.jpg",
    stock: 55,
    rating: 4.1,
    reviewCount: 234,
  },
  {
    name: "Zara Blazer",
    description: "Professional blazer",
    price: 89,
    imageUrl: "https://example.com/zara-blazer.jpg",
    stock: 30,
    rating: 4.5,
    reviewCount: 156,
  },
  {
    name: "Uniqlo Hoodie",
    description: "Comfortable cotton hoodie",
    price: 45,
    imageUrl: "https://example.com/uniqlo-hoodie.jpg",
    stock: 70,
    rating: 4.4,
    reviewCount: 445,
  },
  {
    name: "Nike Joggers",
    description: "Athletic sweatpants",
    price: 55,
    imageUrl: "https://example.com/nike-joggers.jpg",
    stock: 60,
    rating: 4.3,
    reviewCount: 332,
  },
  {
    name: "Ray-Ban Sunglasses",
    description: "Classic aviator sunglasses",
    price: 165,
    imageUrl: "https://example.com/rayban.jpg",
    stock: 40,
    rating: 4.6,
    reviewCount: 567,
  },
  {
    name: "Timberland Boots",
    description: "Waterproof work boots",
    price: 180,
    imageUrl: "https://example.com/timberland.jpg",
    stock: 35,
    rating: 4.8,
    reviewCount: 234,
  },
  {
    name: "Calvin Klein Underwear",
    description: "Cotton boxer briefs pack",
    price: 25,
    imageUrl: "https://example.com/ck-underwear.jpg",
    stock: 100,
    rating: 4.2,
    reviewCount: 789,
  },

  // Books (10 products)
  {
    name: "JavaScript Guide",
    description: "Learn JavaScript programming",
    price: 45,
    imageUrl: "https://example.com/js-book.jpg",
    stock: 200,
    rating: 4.8,
    reviewCount: 789,
  },
  {
    name: "React Handbook",
    description: "Master React development",
    price: 55,
    imageUrl: "https://example.com/react-book.jpg",
    stock: 150,
    rating: 4.6,
    reviewCount: 456,
  },
  {
    name: "Python Cookbook",
    description: "Python recipes and solutions",
    price: 50,
    imageUrl: "https://example.com/python-book.jpg",
    stock: 180,
    rating: 4.5,
    reviewCount: 345,
  },
  {
    name: "Clean Code",
    description: "A handbook of agile software craftsmanship",
    price: 42,
    imageUrl: "https://example.com/clean-code.jpg",
    stock: 120,
    rating: 4.7,
    reviewCount: 1234,
  },
  {
    name: "Design Patterns",
    description: "Elements of reusable object-oriented software",
    price: 58,
    imageUrl: "https://example.com/design-patterns.jpg",
    stock: 90,
    rating: 4.6,
    reviewCount: 567,
  },
  {
    name: "The Pragmatic Programmer",
    description: "Your journey to mastery",
    price: 48,
    imageUrl: "https://example.com/pragmatic-programmer.jpg",
    stock: 110,
    rating: 4.8,
    reviewCount: 890,
  },
  {
    name: "System Design Interview",
    description: "An insider's guide",
    price: 35,
    imageUrl: "https://example.com/system-design.jpg",
    stock: 85,
    rating: 4.5,
    reviewCount: 445,
  },
  {
    name: "Atomic Habits",
    description: "An easy & proven way to build good habits",
    price: 18,
    imageUrl: "https://example.com/atomic-habits.jpg",
    stock: 250,
    rating: 4.9,
    reviewCount: 2340,
  },
  {
    name: "Sapiens",
    description: "A brief history of humankind",
    price: 22,
    imageUrl: "https://example.com/sapiens.jpg",
    stock: 180,
    rating: 4.6,
    reviewCount: 1567,
  },
  {
    name: "The Lean Startup",
    description: "How today's entrepreneurs use continuous innovation",
    price: 28,
    imageUrl: "https://example.com/lean-startup.jpg",
    stock: 140,
    rating: 4.4,
    reviewCount: 678,
  },

  // Home & Garden (8 products)
  {
    name: "Coffee Maker",
    description: "Automatic coffee machine",
    price: 89,
    imageUrl: "https://example.com/coffee-maker.jpg",
    stock: 35,
    rating: 4.3,
    reviewCount: 234,
  },
  {
    name: "Garden Hose",
    description: "50ft garden hose",
    price: 25,
    imageUrl: "https://example.com/garden-hose.jpg",
    stock: 80,
    rating: 4.1,
    reviewCount: 156,
  },
  {
    name: "LED Lamp",
    description: "Modern LED table lamp",
    price: 65,
    imageUrl: "https://example.com/led-lamp.jpg",
    stock: 55,
    rating: 4.4,
    reviewCount: 89,
  },
  {
    name: "Air Fryer",
    description: "Healthy cooking appliance",
    price: 129,
    imageUrl: "https://example.com/air-fryer.jpg",
    stock: 45,
    rating: 4.5,
    reviewCount: 567,
  },
  {
    name: "Robot Vacuum",
    description: "Automatic floor cleaner",
    price: 299,
    imageUrl: "https://example.com/robot-vacuum.jpg",
    stock: 25,
    rating: 4.2,
    reviewCount: 334,
  },
  {
    name: "Succulent Plant Set",
    description: "Indoor plant collection",
    price: 35,
    imageUrl: "https://example.com/succulents.jpg",
    stock: 70,
    rating: 4.6,
    reviewCount: 156,
  },
  {
    name: "Kitchen Knife Set",
    description: "Professional chef knives",
    price: 85,
    imageUrl: "https://example.com/knife-set.jpg",
    stock: 40,
    rating: 4.7,
    reviewCount: 234,
  },
  {
    name: "Throw Pillows",
    description: "Decorative couch pillows",
    price: 28,
    imageUrl: "https://example.com/throw-pillows.jpg",
    stock: 90,
    rating: 4.3,
    reviewCount: 123,
  },

  // Sports (10 products)
  {
    name: "Basketball",
    description: "Professional basketball",
    price: 30,
    imageUrl: "https://example.com/basketball.jpg",
    stock: 70,
    rating: 4.2,
    reviewCount: 123,
  },
  {
    name: "Tennis Racket",
    description: "Carbon fiber tennis racket",
    price: 120,
    imageUrl: "https://example.com/tennis-racket.jpg",
    stock: 25,
    rating: 4.6,
    reviewCount: 67,
  },
  {
    name: "Yoga Mat",
    description: "Non-slip yoga mat",
    price: 40,
    imageUrl: "https://example.com/yoga-mat.jpg",
    stock: 90,
    rating: 4.5,
    reviewCount: 234,
  },
  {
    name: "Dumbbells Set",
    description: "Adjustable weight dumbbells",
    price: 159,
    imageUrl: "https://example.com/dumbbells.jpg",
    stock: 30,
    rating: 4.4,
    reviewCount: 345,
  },
  {
    name: "Soccer Ball",
    description: "FIFA approved soccer ball",
    price: 25,
    imageUrl: "https://example.com/soccer-ball.jpg",
    stock: 60,
    rating: 4.3,
    reviewCount: 178,
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes",
    price: 95,
    imageUrl: "https://example.com/running-shoes.jpg",
    stock: 55,
    rating: 4.5,
    reviewCount: 456,
  },
  {
    name: "Resistance Bands",
    description: "Exercise resistance bands set",
    price: 22,
    imageUrl: "https://example.com/resistance-bands.jpg",
    stock: 85,
    rating: 4.2,
    reviewCount: 234,
  },
  {
    name: "Golf Club Set",
    description: "Complete golf club set",
    price: 299,
    imageUrl: "https://example.com/golf-clubs.jpg",
    stock: 15,
    rating: 4.6,
    reviewCount: 89,
  },
  {
    name: "Protein Shaker",
    description: "BPA-free protein bottle",
    price: 15,
    imageUrl: "https://example.com/protein-shaker.jpg",
    stock: 120,
    rating: 4.1,
    reviewCount: 567,
  },
  {
    name: "Exercise Bike",
    description: "Indoor stationary bike",
    price: 399,
    imageUrl: "https://example.com/exercise-bike.jpg",
    stock: 18,
    rating: 4.4,
    reviewCount: 123,
  },
];

const seedData = async () => {
  try {
    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("Cleared existing data");

    // Insert categories
    const createdCategories = await Category.insertMany(seedCategories);
    console.log("Categories seeded successfully");

    // Map category names to IDs
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // Assign categories to products
    const productsWithCategories = [
      // Electronics (first 15 products)
      ...seedProducts.slice(0, 15).map((product) => ({
        ...product,
        category: categoryMap["Electronics"],
      })),
      // Clothing (next 12 products)
      ...seedProducts.slice(15, 27).map((product) => ({
        ...product,
        category: categoryMap["Clothing"],
      })),
      // Books (next 10 products)
      ...seedProducts.slice(27, 37).map((product) => ({
        ...product,
        category: categoryMap["Books"],
      })),
      // Home & Garden (next 8 products)
      ...seedProducts.slice(37, 45).map((product) => ({
        ...product,
        category: categoryMap["Home & Garden"],
      })),
      // Sports (last 10 products)
      ...seedProducts.slice(45, 55).map((product) => ({
        ...product,
        category: categoryMap["Sports"],
      })),
    ];

    // Insert products
    await Product.insertMany(productsWithCategories);
    console.log("Products seeded successfully");

    console.log("Data seeding completed!");
    console.log(`Categories created: ${createdCategories.length}`);
    console.log(`Products created: ${productsWithCategories.length}`);
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed");
  }
};

// Run seeding
(async () => {
  await connection();
  await seedData();
})();
