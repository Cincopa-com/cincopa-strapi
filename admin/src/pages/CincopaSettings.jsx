import React, { useEffect, useState } from "react";
import { Layouts, Page } from '@strapi/strapi/admin';
import { Box, TextInput, Button } from "@strapi/design-system";
import { useFetchClient } from '@strapi/strapi/admin';

const CincopaSettings = () => {
  const { get, post } = useFetchClient();
  const [apiToken, setApiToken] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await get("/cincopa-uploader-plugin/token");
        setApiToken(response.data?.token || "");
      } catch (error) {
        console.error("Error fetching API token:", error);
      }
    };

    fetchToken();
  }, []);

  const handleSave = async () => {
    try {
      await post("/cincopa-uploader-plugin/token", { token: apiToken });
      alert("API Token saved successfully!");
    } catch (error) {
      console.error("Error saving API token:", error);
    }
  };

  return (
    <Page.Main>
      <Layouts.Header title="Configuration" />
      <Layouts.Content>
        <Box padding={8} background="white">
        <TextInput
            label="Cincoap API Token"
            placeholder="Enter your API token"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
          />
          <Button
            onClick={handleSave}
            style={{ marginTop: '10px' }}
          >Save</Button>
        </Box>
      </Layouts.Content>
     </Page.Main>
  );
};

export default CincopaSettings;
