import { MenuGroup } from '@/types';

export const menuGroup: MenuGroup = {
  main: [
    {
      menuName: '티 제품',
      menuId: 'product',
      upperMenuId: null,
    },
    {
      menuName: 'Pension',
      menuId: 'pension',
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
      menuName: '우티',
      menuId: 'wuti',
      upperMenuId: 'pension',
    },
    {
      menuName: '아티',
      menuId: 'ati',
      upperMenuId: 'pension',
    },
  ],
};
