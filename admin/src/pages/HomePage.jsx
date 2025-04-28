import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layouts, Page } from '@strapi/strapi/admin';
import { Flex, Grid, Box, SingleSelect, SingleSelectOption, Button } from '@strapi/design-system';
import Header from '../components/header/index';
import AssetsList from '../components/assets-list/index';
import { appendQueryParameter } from '../utils/url';
import { useFetchClient } from '@strapi/strapi/admin';
import { apiAssetList } from '../constants/index';

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
  const [isMoreAssets, handleMoreAssets] = useState(false);


  // Function to load a script dynamically
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(new Error(`Script load error: ${src}`));
      document.body.appendChild(script);
    });
  };


 useEffect(() => {
    const loadScripts = async () => {
      try {
        // Load the first script
        await loadScript("https://wwwcdn.cincopa.com/_cms/ugc/uploaderui.js");

        // Load the second script after the first one finishes
        await loadScript("//wwwcdn.cincopa.com/_cms/media-platform/libasync.js");

      } catch (error) {
        console.error("Error loading scripts:", error);
      }
    };

    loadScripts();
  }, []);


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
    .get('/cincopa-uploader/cincopa-settings')
    .then((response) => {
        setConfigs(response?.data);
    })
    .catch((error) => {
        console.error('Error fetching configs:', error);
    });
  };

  const fetchData = async (firstPage) => {
    try {
      const currentPage = firstPage ? firstPage : page;
      const response = await fetch(`${apiAssetList}?api_token=${configs.apiToken}&items_per_page=50&page=${currentPage}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();

      if(result?.items_data.page < result?.items_data.pages_count){
        handleMoreAssets(true);
      }else{
        handleMoreAssets(false);
      }

      if(firstPage){
        setData(result);
        setSearchValue('');
      }else{
        setData((prevData) => {
          return prevData
            ? { ...result, items: [...prevData.items, ...result.items] }
            : result;
        });
      }

      setPage(prevPage => prevPage + 1);
      setPages(result?.items_data.pages_count);
      handleLoading(false);
    } catch (err) {
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
      let url = `${apiAssetList}?api_token=${configs.apiToken}`;
      if(searchFieldDefault == 'by_asset_id') {
        url += `&rid=${searchValue}`;
      }else if(searchFieldDefault == 'by_title') {
        url += `&search=${searchValue}`;
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
        handleMoreAssets(false);
      } catch (err) {
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

  const handleUpdated = () => {
    if(!searchValue){
      fetchData(1);
    }
  };

  const handleClearSearch = () => {
    fetchData(1);
  }

  return (
    <Layouts.Root>
      <Page.Main>
      <Header configs={configs} onUpdated={handleUpdated} />
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
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type="text"
                    name="searchbar"
                    placeholder="Searching for Cincopa assets"
                    value={searchValue}
                    onChange={handleOnSearchValueChange}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                  {searchValue && (
                    <button
                      onClick={handleClearSearch}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                      }}
                    >
                      ✖
                    </button>
                  )}
                </div>
            </Box>
          </Grid.Item>
        </Grid.Root>
        }
      />
      <Layouts.Content>
        <AssetsList configs={configs}  userAssets={data?.items} isLoading={isLoading} />
        {!isLoading && isMoreAssets && (
          <Flex justifyContent="center">
            <Button onClick={loadMoreAssets}>Load More</Button>
          </Flex>
        )}
      </Layouts.Content>
      </Page.Main>
    </Layouts.Root>
  );
};

export { HomePage };
