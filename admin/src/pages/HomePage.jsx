import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layouts, Page } from '@strapi/strapi/admin';
import { Flex, Grid, Box, SingleSelect, Searchbar, SingleSelectOption, Button } from '@strapi/design-system';
import Header from '../components/header/index';
import AssetsList from '../components/assets-list/index';
import { appendQueryParameter } from '../utils/url';

const HomePage = () => {
  const searchFields = [
    {
      label: 'By Title',
      value: 'by_title',
    },
    {
      label: 'By Asset Id',
      value: 'by_asset_id',
    },
    {
      label: 'By Asset Type',
      value: 'by_asset_type',
    },
    {
      label: 'By Asset Tag',
      value: 'by_asset_tag',
    },
  ];
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [isLoading, handleLoading] = useState(true);
  const [searchField, setSearchField] = useState(searchFields[0].value);
  const [searchValue, setSearchValue] = useState('');

  // const [isUpdate, handleUpdateData] = useState(false);
  // const [error, setError] = useState(null);



  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.cincopa.com/v2/asset.list.json?api_token=230692iojeswdxdgkmnxklh25rivovgmpc&items_per_page=50&page=' + page);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      setData((prevData) => {
        return prevData
          ? { ...result, items: [...prevData.items, ...result.items] }
          : result;
      });
      setPage(prevPage => prevPage + 1);
      setPages(result?.items_data.pages_count);
      handleLoading(false);
      // console.log(data, 'resssssult');
    } catch (err) {
      // setError(err.message);
      handleLoading(false);
    }
  };


  const handleOnSearchFieldChange = (field) => {
    navigate(appendQueryParameter(location, { field }));
  };

  const handleOnSearchValueChange = (event) => {
    navigate(appendQueryParameter(location, { value: event?.target.value || '' }));
  };

  const loadMoreAssets = () => {
    handleLoading(true);
    fetchData();
  }
  return (
    <Layouts.Root>
      <Page.Main>
      <Header />
      <Layouts.Action
        startActions={
        <Grid.Root gap={4}>
          <Grid.Item col={2} xs={12} s={12}>
            <SingleSelect
              placeholder="Search field"
              value={searchField}
              onChange={(value) => handleOnSearchFieldChange(value.toString())}
            >
              {searchFields.map((searchField) => (
                <SingleSelectOption value={searchField.value} key={searchField.value}>
                  {searchField.label}
                </SingleSelectOption>
              ))}
            </SingleSelect>
          </Grid.Item>
          <Grid.Item col={8} xs={12} s={12}>
            <Box width="100%">
                <Searchbar
                  name="searchbar"
                  // onClear={() => setSearchValue('')}
                  clearLabel="Clear search"
                  value={searchValue}
                  onChange={handleOnSearchValueChange}
                />
            </Box>
          </Grid.Item>
        </Grid.Root>
        }
      />
      <Layouts.Content>
        <AssetsList userAssets={data?.items} isLoading={isLoading} />
        {!isLoading && data?.items?.length == 0 && (
          <Flex justifyContent="center">
            <Button onClick={loadMoreAssets}>
              Load More
            </Button>
          </Flex>
        )}
      </Layouts.Content>
      </Page.Main>
    </Layouts.Root>
  );
};

export { HomePage };
