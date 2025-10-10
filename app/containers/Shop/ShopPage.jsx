import { Container,  PageHeader } from '@/components';
import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ShopListPage from './ShopListPage';

function ShopPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const handleAddShop = () => {
    navigate('/shops/add');
  };
  return (
    <Container>
      <PageHeader
        title="Shop"
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Shop' },
        ]}
        onAddClick={handleAddShop}
        addButtonLabel="Add Shop"
        variant="outline"
      />
      <ShopListPage refreshTrigger={refreshTrigger}/>
    </Container>
  );
}

export default ShopPage;
