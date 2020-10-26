import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";
import axios from "axios";

interface IProduct {
  id: string;
  title: string;
}

interface CategoryProps {
  products: IProduct[];
}

export default function Category({ products }: CategoryProps) {
  const router = useRouter();

  // Caso a página ainda não tiver sido gerada
  if (router.isFallback) {
    return <p>Carregando...</p>
  }

  return (
    <div>
      <h1>{router.query.slug}</h1>

      <ul>
        {products.map((product) => {
          return <li key={product.id}>{product.title}</li>;
        })}
      </ul>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  let categories = null;

  await axios.get(`http://localhost:3333/categories`).then((response) => {
    categories = response.data;
  });

  const paths = categories.map((category) => {
    return {
      params: { slug: category.id },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<CategoryProps> = async (
  context
) => {
  const { slug } = context.params;

  let products = null;

  await axios
    .get(`http://localhost:3333/products?category_id=${slug}`)
    .then((response) => {
      products = response.data;
    });

  return {
    props: {
      products,
    },
    revalidate: 60, // Tempo em segundos;
  };
};
