import React from "react";
import Hero from "./Hero";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import BestSeller from "./BestSeller";
import CounDown from "./Countdown";
import Testimonials from "./Testimonials";
import Newsletter from "../Common/Newsletter";

import { Product } from "@/types/product";
import { Category } from "@/types/supabase";

interface HomeProps {
  products: Product[];
  categories: Category[];
}

const Home = ({ products, categories }: HomeProps) => {
  return (
    <main>
      <Hero />
      <Categories categories={categories} />
      <NewArrival products={products} />
      <PromoBanner />
      <BestSeller products={products} />
      <CounDown />
      <Testimonials />
      <Newsletter />
    </main>
  );
};

export default Home;
