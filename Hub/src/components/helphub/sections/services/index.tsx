"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ServiceDialog } from "./service-dialog";
import { ProductCard } from "./product-card";
import { SectionShell } from "@/components/helphub/layout";
import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";
import { products, type Product } from "@/lib/helphub/products";

export function Services() {
  const [selected, setSelected] = React.useState<Product | null>(null);
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <SectionShell id="servicos" className="overflow-x-clip bg-background">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className={cn(responsive.sectionHeading, "text-foreground")}>
          O que vendemos
        </h2>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Explore nossos produtos. Clique em qualquer card para conhecer os detalhes e o que está incluso.
        </p>
      </div>

      <div className="mx-auto max-w-3xl sm:max-w-4xl lg:max-w-5xl">
        <Carousel
          setApi={setApi}
          opts={{ align: "center", loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-3 py-6 sm:-ml-4 sm:py-8">
            {products.map((product, index) => (
              <CarouselItem
                key={product.id}
                className={cn("pl-3 sm:pl-4", responsive.carouselItemBasis)}
              >
                <ProductCard
                  product={product}
                  selected={index === current}
                  onSelect={() => {
                    api?.scrollTo(index);
                    setSelected(product);
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className={responsive.carouselNav} />
          <CarouselNext className={responsive.carouselNav} />
        </Carousel>
      </div>

      <ServiceDialog selected={selected} onClose={() => setSelected(null)} />
    </SectionShell>
  );
}
