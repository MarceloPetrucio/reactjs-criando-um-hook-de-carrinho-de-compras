import React, { useState, useEffect } from 'react'
import { MdAddShoppingCart } from 'react-icons/md'

import { ProductList } from './styles'
import { api } from '../../services/api'
import { formatPrice } from '../../util/format'
import { useCart } from '../../hooks/useCart'
import axios from 'axios'

interface Product {
  id: number
  title: string
  price: number
  image: string
}

interface ProductFormatted extends Product {
  priceFormatted: string
}

interface CartItemsAmount {
  [key: number]: number
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([])
  const { addProduct, cart } = useCart()

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    sumAmount[product.id] = product.amount
    return sumAmount
  }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      const result = await api.get('http://localhost:3333/products')
      const listProducts: Product[] = result.data
      const productsFormatted: ProductFormatted[] = listProducts.map(
        product => {
          return {
            id: product.id,
            image: product.image,
            price: product.price,
            priceFormatted: formatPrice(product.price),
            title: product.title
          }
        }
      )

      setProducts(productsFormatted)
    }

    loadProducts()
  }, [])

  function handleAddProduct(id: number) {
    addProduct(id)
  }

  return (
    <ProductList>
      {products.map(product => {
        return (
          <li key={product.id}>
            <img src={product.image} alt={product.title} />
            <strong>{product.title}</strong>
            <span>{product.priceFormatted}</span>
            <button
              type="button"
              data-testid="add-product-button"
              onClick={() => handleAddProduct(product.id)}
            >
              <div data-testid="cart-product-quantity">
                <MdAddShoppingCart size={16} color="#FFF" />
                {cartItemsAmount[product.id] || 0}
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        )
      })}
    </ProductList>
  )
}

export default Home

// <li>
//         <img
//           src="https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg"
//           alt="Tênis de Caminhada Leve Confortável"
//         />
//         <strong>Tênis de Caminhada Leve Confortável</strong>
//         <span>R$ 179,90</span>
//         <button
//           type="button"
//           data-testid="add-product-button"
//           // onClick={() => handleAddProduct(product.id)}
//         >
//           <div data-testid="cart-product-quantity">
//             <MdAddShoppingCart size={16} color="#FFF" />
//             {/* {cartItemsAmount[product.id] || 0} */} 2
//           </div>

//           <span>ADICIONAR AO CARRINHO</span>
//         </button>
//       </li>
