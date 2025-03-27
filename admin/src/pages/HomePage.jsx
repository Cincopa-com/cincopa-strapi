import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layouts, Page } from '@strapi/strapi/admin';
import { Flex, Grid, Box, SingleSelect, Searchbar, SingleSelectOption, Button } from '@strapi/design-system';
import Header from '../components/header/index';
import AssetsList from '../components/assets-list/index';
import { appendQueryParameter } from '../utils/url';
// const config = strapi.config.get('plugin.cincopa-uploader-plugin');
// const token = config.apiToken;
// import { Config } from '../../../admin/src/index';
import { useFetchClient } from '@strapi/strapi/admin';
const HomePage = () => {
  const client = useFetchClient();
  const searchFields = [
    { label: 'By Title', value: 'by_title' },
    { label: 'By Asset Id', value: 'by_asset_id' },
    { label: 'By Asset Tag', value: 'by_asset_tag' },
  ];
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [isLoading, handleLoading] = useState(true);
  const [searchFieldDefault, setSearchFieldDefault] = useState(searchFields[0].value);
  const [searchValue, setSearchValue] = useState('');
  const [filterTimer, setFilterTimer] = useState(null);
  const [isUpdate, handleUpdateData] = useState(false);
  useEffect(() => {

    client
            .get(`/cincopa-uploader-plugin/get-configs`)
            .then((response) => {
              console.log(2222)
                // setConfigs(response.data);
            })
            .catch((error) => {
                console.error('Error fetching configs:', error);
            });
    fetchData();
  }, [client]);

  useEffect(() => {
    if (searchFieldDefault && searchValue != '') {
      handleLoading(true);
      getFilteredData();
    }

    if (filterTimer) {
      clearTimeout(filterTimer);
    }
    // else if(isUpdate){
    //   setPage(1);
    //   fetchData();
    // }
  }, [searchFieldDefault, searchValue]);

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
      let url = 'https://api.cincopa.com/v2/asset.list.json?api_token=230692iojeswdxdgkmnxklh25rivovgmpc';
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
      <Header />
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
