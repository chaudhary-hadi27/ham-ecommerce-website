import { Category } from "@/types/supabase";
import React from "react";
import Image from "next/image";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

const SingleItem = ({ item }: { item: Category }) => {
  const imageUrl = item.image || '/images/categories/category-placeholder.png';
  const optimizedImageUrl = getOptimizedImageUrl(imageUrl, { width: 130, height: 130 });

  return (
    <a href={`/shop-with-sidebar?category=${item.slug}`} className="group flex flex-col items-center">
      <div className="max-w-[130px] w-full bg-[#F2F3F8] h-32.5 rounded-full flex items-center justify-center mb-4 overflow-hidden">
        <Image
          src={optimizedImageUrl}
          alt={item.title}
          width={130}
          height={130}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex justify-center">
        <h3 className="inline-block font-medium text-center text-dark bg-gradient-to-r from-blue to-blue bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_1px] group-hover:text-blue">
          {item.title}
        </h3>
      </div>
    </a>
  );
};

export default SingleItem;
