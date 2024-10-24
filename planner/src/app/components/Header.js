//user can navigate journal pages and add new pages
"use client"
//can the tabs be veritcal?
//should menu items be categories or individual pages???
//willsubheader be pulling from db too much for user info? page reloads? or does next handle state and remount???
import { daysInMonth, date, firstDayOfMonth } from "../utils/dateUtils.js";
import { Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tabs, 
  TabList, 
  Tab, 
  Button } from '@chakra-ui/react'
import { fakeDBData, availablePages } from '../utils/mockData.js';
import React, { useState, useRef } from "react";

export const Header = (props) => {
  const [userPages, setUserPages] = useState(fakeDBData);
  //temporary addPage, will need to save to db
  const addPage = (type) => {
    let helper = [...userPages, {id: 2, type, user_id : 123, dataArray : [], month: 11, year: 2024 } ]
    setUserPages(helper)
  }
  
  return ( 
    <Box>
      <Tabs isManual variant="enclosed" >
        <TabList >

          {userPages.map(function (object, i) {
                      return <Tab key={i}> {object.type} </Tab>;
                    })}

          <Menu>
            <MenuButton as={Button} >
              +
            </MenuButton>
            <MenuList>
              {availablePages.map(function (object, i) {
                    return <MenuItem key={object.type} onClick={()=> addPage(object.type)}> {object.type} </MenuItem>;
                  })}
            </MenuList>
          </Menu>

        </TabList>
      </Tabs>
    </Box>
)}