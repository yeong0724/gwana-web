import PageTransition from '@/components/common/PageTransition';

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const Layout = ({ children }: LayoutProps) => {
  return <PageTransition>{children}</PageTransition>;
};

export default Layout;
