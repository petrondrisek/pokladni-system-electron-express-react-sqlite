import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function RefreshRoute() {
  const navigate = useNavigate();
  const { linkTo } = useParams();

  useEffect(() => {
    navigate(`/${linkTo === 'dashboard' ? '' : linkTo}`); // Přesměrování o jeden krok zpět v historii
  }, [navigate, linkTo]);

  return (
    <>
    <p>
        Proběhne přesměrování..    
    </p>
    </>
  );
}

export default RefreshRoute;