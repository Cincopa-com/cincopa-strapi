import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layouts, Page } from '@strapi/strapi/admin';
import { Flex, Grid, Box, SingleSelect, Searchbar, SingleSelectOption, Button } from '@strapi/design-system';
import Header from '../components/header/index';
import AssetsList from '../components/assets-list/index';
import { appendQueryParameter } from '../utils/url';
import { useFetchClient } from '@strapi/strapi/admin';

const HomePage = () => {
  const client = useFetchClient();
  const location = useLocation();
  const navigate = useNavigate();
  const searchFields = [
    { label: 'By Title', value: 'by_title' },
    { label: 'By Asset Id', value: 'by_asset_id' },
    { label: 'By Asset Tag', value: 'by_asset_tag' },
  ];
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [isLoading, handleLoading] = useState(true);
  const [searchFieldDefault, setSearchFieldDefault] = useState(searchFields[0].value);
  const [searchValue, setSearchValue] = useState('');
  const [filterTimer, setFilterTimer] = useState(null);
  const [configs, setConfigs] = useState(null);
  const [isUpdate, handleUpdateData] = useState(false);

  useEffect(() => {
    getConfigs();
  }, []);

  useEffect(() => {
    if (configs && configs.apiToken) {
      fetchData();
    }
  }, [configs]);

  useEffect(() => {
    if (searchFieldDefault && searchValue != '') {
      handleLoading(true);
      getFilteredData();
    }

    if (filterTimer) {
      clearTimeout(filterTimer);
    }

  }, [searchFieldDefault, searchValue]);

  const getConfigs = async() => {
    await client
    .get('/api/cincopa-uploader-plugin/get-configs')
    .then((response) => {
        setConfigs(response?.data);
    })
    .catch((error) => {
        console.error('Error fetching configs:', error);
    });
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`https://api.cincopa.com/v2/asset.list.json?api_token=${configs.apiToken}&items_per_page=50&page=${page}`);

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
      handleUpdateData(true);
    } catch (err) {
      // setError(err.message);
      setData({});
      handleLoading(false);
    }
  };

  const getFilteredData = async () => {
    if (filterTimer) {
      clearTimeout(filterTimer);
    }
    if (!searchValue) return;

    const newFilterTimer = setTimeout(async () => {
      let url = `https://api.cincopa.com/v2/asset.list.json?api_token=${configs.apiToken}`;
      if(searchFieldDefault == 'by_asset_id') {
        url += `&rid=${searchValue}`;
      }else if(searchFieldDefault == 'by_title') {
        url += `&details=${searchValue}`;
      }else if(searchFieldDefault == 'by_asset_tag'){
        url += `&tag=${searchValue}`
      }else{
        return;
      }

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const filteredResult = await response.json();
        setData(filteredResult);
        handleLoading(false);
      } catch (err) {
        console.log(err, 'error');
        handleLoading(false);
        setData({});
      }
    }, 800);
    setFilterTimer(newFilterTimer);
  };


  const handleOnSearchFieldChange = (value) => {
    setSearchFieldDefault(value);
    navigate(appendQueryParameter(location, { type: value }));
  };

  const handleOnSearchValueChange = (event) => {
    setSearchValue(event.target.value);
    navigate(appendQueryParameter(location, { value: event?.target.value || '' }));
  };

  const loadMoreAssets = () => {
    handleLoading(true);
    fetchData();
  }
  return (
    <Layouts.Root>
      <Page.Main>
      <Header configs={configs} />
      <Layouts.Action
        startActions={
        <Grid.Root gap={4}>
          <Grid.Item col={2} xs={12} s={12}>
            <SingleSelect
              placeholder="Search field"
              value={searchFieldDefault}
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
                  onClear={() => setSearchValue('')}
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
