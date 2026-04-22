import { MenuGroup } from '@/types';

export const menuGroup: MenuGroup = {
  main: [
    {
      menuName: 'Story',
      menuId: 'about',
      upperMenuId: null,
    },
    {
      menuName: 'Store',
      menuId: 'product',
      upperMenuId: null,
    },
    {
      menuName: 'Management',
      menuId: 'admin',
      upperMenuId: null,
    },
  ],
  category: [
    {
      menuName: '녹차',
      menuId: 'greenTea',
      upperMenuId: 'product',
    },
    {
      menuName: '홍차',
      menuId: 'blackTea',
      upperMenuId: 'product',
    },
    {
      menuName: '대용차',
      menuId: 'substituteTea',
      upperMenuId: 'product',
    },
    {
      menuName: '상품 관리',
      menuId: 'product-management',
      upperMenuId: 'admin',
    },
    {
      menuName: '주문 관리',
      menuId: 'order-management',
      upperMenuId: 'admin',
    },
  ],
};
