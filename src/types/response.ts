export interface UserResponse {
  userId: string;
  username: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'GENERAL';
}

export type Menu = {
  menuName: string;
  menuId: string;
  upperMenuId: string | null;
};

export type MenuGroup = {
  main: Menu[];
  category: Menu[];
};

export type Product = {
  productId: string;
  productName: string;
  categoryId: string;
  categoryName: string;
  images: string[];
  infos: string[];
  price: number;
  shippingPrice: number;
};

export type Cart = {
  cartId: string;
  quantity: number;
  productId: string;
  productName: string;
  categoryName: string;
  price: number;
  shippingPrice: number;
  images: string[];
};

export type PaymentSession = {
  productId: string;
  productName: string;
  categoryName: string;
  quantity: number;
  price: number;
  shippingPrice: number;
  images: string[];
};
