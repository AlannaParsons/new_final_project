// used to edit current page. delete and settings edits

"use client"

import {
  Box,
  Button,
  Flex,
  IconButton,
  Tab,
  Tabs,
  TabList,

} from '@chakra-ui/react';
//https://www.npmjs.com/package/react-calendar
import { DeleteIcon, SettingsIcon, CloseIcon } from '@chakra-ui/icons';

export const PageControls = (props) => {

  return ( 
    <Box>
      <Tabs isManual variant="enclosed" >
        <TabList >
          <Tab>                 
            <SettingsIcon/>
          </Tab>


          <Tab onClick={() => router.push(`/availablePages`)}>                 
            <DeleteIcon/>
          </Tab>

        </TabList>
      </Tabs>
    </Box>
  )

}