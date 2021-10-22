import React, { useState } from 'react';
import { Search as SearchIcon } from '@mui/icons-material';
import {
  InputLabel,
  MenuItem,
  Pagination,
  FormControl,
  Select,
  Box,
  Paper,
  InputBase,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import Products from '@src/components/home/Product';
import { Product } from '@src/utils/types';

// icons

const getProducts = async () => {
  const { data } = await axios.get('/api/products');
  return data;
};
const getCategories = async () => {
  const { data } = await axios.get('/api/categories');
  return data;
};

const gallery = () => {
  const {
    data: products,
    isLoading,
    isSuccess,
  } = useQuery<Product[], Error>('products', getProducts, {
    staleTime: 3000,
  });

  const { data: categories, isSuccess: catSuccess } = useQuery('categories', getCategories, {
    staleTime: 3000,
  });

  const postsPerPage = 8;
  const [category, setCategory] = useState('');
  const [filterFn, setFilterFn] = useState({ fn: (items) => items });
  const [filterFc, setFilterFc] = useState({ fc: (items) => items });
  const [currentPage, setCurrentPage] = useState(1);
  const numberOfPage = Math.ceil(products.length / postsPerPage);

  const handlePageChange = (_e, val) => {
    setCurrentPage(val);
  };

  const handleSearch = (event) => {
    const target = event.target.value;
    setFilterFn({
      fn: (items) => {
        if (target === '') return items;
        return items.filter((i) => i.name.toLowerCase().includes(target));
      },
    });
  };

  const handleCategoryFilter = (value) => {
    setCategory(value);
    setFilterFc({
      fc: (items) => {
        if (value === '' || !value) return items;
        return items.filter((i) => i.category.toLowerCase().includes(value));
      },
    });
  };
  return (
    <>
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Paper
            component="form"
            sx={{
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              height: 40,
              borderRadius: 5,
              width: '25rem',
              border: '1px solid #E5E8EC',
              marginBottom: 0,
            }}
            elevation={0}
          >
            <InputBase
              sx={{
                flex: 1,
                marginLeft: '1rem',
              }}
              placeholder="Cari..."
              onChange={handleSearch}
            />
            <IconButton style={{ padding: 10 }} aria-label="search" size="small">
              <SearchIcon />
            </IconButton>
          </Paper>
          <Paper
            component="form"
            style={{
              height: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 0,
              width: '14rem',
            }}
            elevation={0}
          >
            <FormControl variant="outlined" sx={{ minWidth: '14rem', margin: '1rem' }} size="small">
              <InputLabel id="demo-simpl">Kategori</InputLabel>
              <Select
                labelId="demo-simpl"
                id="demo-simpl"
                value={category}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                label="Category"
                style={{ textTransform: 'capitalize', borderRadius: 5 }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {catSuccess &&
                  categories?.map((cat) => (
                    <MenuItem key={cat.id} value={cat.title} style={{ textTransform: 'capitalize' }}>
                      {cat.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Paper>
        </Box>
        <Box style={{ marginTop: '2rem' }}>
          <Products
            products={filterFn
              .fn(filterFc.fc(products))
              .slice((currentPage - 1) * postsPerPage, (currentPage - 1) * postsPerPage + postsPerPage)}
            isLoading={isLoading}
            isSuccess={isSuccess}
          />
        </Box>

        <Box
          style={{
            marginTop: '4rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Pagination
            count={numberOfPage}
            variant="outlined"
            shape="rounded"
            color="primary"
            page={currentPage}
            onChange={handlePageChange}
          />
        </Box>
      </Box>
    </>
  );
};

export default gallery;

// eslint-disable-next-line consistent-return
export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery('products', getProducts);
  await queryClient.prefetchQuery('categories', getCategories);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
