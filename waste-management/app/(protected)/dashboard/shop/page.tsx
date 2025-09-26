"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserProfile } from "@/store/profile.store";
import { 
  ShoppingCart, 
  Star, 
  Recycle, 
  Trash2, 
  Leaf, 
  Package,
  Filter,
  Search
} from "lucide-react";

interface ShopItem {
  id: number;
  name: string;
  description: string;
  price: number;
  pointsPrice: number;
  image: string;
  category: 'bins' | 'bags' | 'tools' | 'eco-friendly';
  rating: number;
  reviews: number;
  inStock: boolean;
  discount?: number;
}

export default function Shop() {
  const { profile } = useUserProfile();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<{[key: number]: number}>({});

  const shopItems: ShopItem[] = [
    {
      id: 1,
      name: "Smart Waste Bin",
      description: "IoT-enabled waste bin with automatic sorting and compaction",
      price: 299.99,
      pointsPrice: 2500,
      image: "https://www.mr-fill.com/wp-content/uploads/2020/12/vm10252-scaled.jpg",
      category: 'bins',
      rating: 4.8,
      reviews: 124,
      inStock: true,
      discount: 15
    },
    {
      id: 2,
      name: "Biodegradable Bags",
      description: "Eco-friendly compostable bags - Pack of 50",
      price: 24.99,
      pointsPrice: 200,
      image: "https://images.unsplash.com/photo-1582803824122-f25becf36ad8?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: 'bags',
      rating: 4.6,
      reviews: 89,
      inStock: true
    },
    {
      id: 3,
      name: "Recycling Sorting Kit",
      description: "Complete kit with color-coded bins for different waste types",
      price: 149.99,
      pointsPrice: 1200,
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300&h=200&fit=crop",
      category: 'bins',
      rating: 4.9,
      reviews: 156,
      inStock: true
    },
    {
      id: 4,
      name: "Compost Accelerator",
      description: "Organic compost accelerator for faster decomposition",
      price: 19.99,
      pointsPrice: 150,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop",
      category: 'eco-friendly',
      rating: 4.4,
      reviews: 67,
      inStock: true
    },

    {
      id: 6,
      name: "Reusable Shopping Bags",
      description: "Set of 5 durable, washable shopping bags",
      price: 29.99,
      pointsPrice: 250,
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: 'eco-friendly',
      rating: 4.5,
      reviews: 201,
      inStock: true,
      discount: 20
    },
    {
      id: 7,
      name: "Heavy Duty Trash Bags",
      description: "Extra strong bags for heavy waste - Pack of 25",
      price: 34.99,
      pointsPrice: 300,
      image: "https://images.unsplash.com/photo-1611830696076-462acd8aa9e9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: 'bags',
      rating: 4.3,
      reviews: 78,
      inStock: true
    },

  ];

  const categories = [
    { id: 'all', name: 'All Items', icon: Package },
    { id: 'bins', name: 'Waste Bins', icon: Trash2 },
    { id: 'bags', name: 'Waste Bags', icon: Package },
    { id: 'tools', name: 'Tools', icon: Package },
    { id: 'eco-friendly', name: 'Eco-Friendly', icon: Leaf }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory);

  const addToCart = (itemId: number) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const getTotalCartItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const canAffordWithPoints = (pointsPrice: number) => {
    return profile.points >= pointsPrice;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Waste Management Shop</h1>
            <p className="text-muted-foreground">Eco-friendly products for sustainable living</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{profile.points || 0} Points</span>
            </div>
            <Button variant="outline" className="relative">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {getTotalCartItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {getTotalCartItems()}
                </Badge>
              )}
            </Button>
          </div>
        </div>

     
    {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Recycle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Eco-Friendly Products</h3>
              <p className="text-sm text-muted-foreground">
                All products are environmentally sustainable and promote green living
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Earn Points</h3>
              <p className="text-sm text-muted-foreground">
                Earn points with every purchase and redeem them for future orders
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-sm text-muted-foreground">
                High-quality products with warranty and customer support
              </p>
            </CardContent>
          </Card>
        </div>
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-full h-full flex items-center justify-center bg-muted">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                {item.discount && (
                  <Badge className="absolute top-2 text-white left-2 bg-red-500">
                    -{item.discount}%
                  </Badge>
                )}
                {!item.inStock && (
                  <Badge variant="secondary" className="absolute top-2 right-2">
                    Out of Stock
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({item.reviews} reviews)
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground">
                      ₹{item.discount ? 
                        (item.price * (1 - item.discount / 100)).toFixed(2) : 
                        item.price.toFixed(2)
                      }
                    </span>
                    {item.discount && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${item.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">
                      {item.pointsPrice} points
                    </span>
                    {!canAffordWithPoints(item.pointsPrice) && (
                      <Badge variant="outline" className="text-xs">
                        Need {item.pointsPrice - profile.points} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    disabled={!item.inStock}
                    onClick={() => addToCart(item.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    disabled={!item.inStock || !canAffordWithPoints(item.pointsPrice)}
                    onClick={() => addToCart(item.id)}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Buy with Points
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No items found
            </h3>
            <p className="text-muted-foreground">
              Try selecting a different category or check back later for new products.
            </p>
          </div>
        )}

    
      </div>
    </div>
  );
}