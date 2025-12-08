import PageTransition from '@/components/common/PageTransition';
import MainContainer from '@/components/features/MainContainer';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
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

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const Layout = ({ children }: RootLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header menuGroup={menuGroup} />
      <main className="flex-1 min-h-[1800px]">
        <PageTransition>
          <MainContainer>{children}</MainContainer>
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
