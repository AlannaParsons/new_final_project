//user can navigate journal pages and add new pages
"use client"
//can the tabs be veritcal?
//should menu items be categories or individual pages??? start w individual pages
//make sure all tabs are visible.. somewhow
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
  import NextLink from 'next/link'
  import { Link } from '@chakra-ui/react'
  import { PageControls } from '@/components/PageControls';

  import { usePathname } from 'next/navigation'

import { fakeDBData, availablePages } from '../utils/mockData.js';
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';

export const Header = (props) => {
  let user = '3958dc9e-712f-4377-85e9-fec4b6a6442a';
  const router = useRouter()
  const [userPages, setUserPages] = useState([]);
  const [activePage, setActivePage] = useState(usePathname());
  //temporary addPage, will need to save to db
  // const addPage = (type) => {
  //   let helper = [...userPages, {id: 2, type, user_id : 123, dataArray : [], month: 11, year: 2024 } ]
  //   setUserPages(helper)
  // }

  //get all pages saved by given user ID
  useEffect(() => {
    getPages(user)
  }, []);

  console.log('route?', usePathname())

  const getPages = async (userID) => {
    try {
      const res = await fetch(`/api/header/${userID}`,{
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        setUserPages(response);
        
        console.log("Yeai!",response)
      }else{
        console.log("Oops! Something is wrong.")
      }
    } catch (error) {
        console.log(error)
    }
  }
//add dropdown?
  // <Menu>
  //           <MenuButton as={Button} >
  //             +
  //           </MenuButton>
  //           <MenuList>
 
  //               <MenuItem>
  //               <Link as={NextLink} href='/availablePages'>
  //                 ...
  //               </Link>
  //               </MenuItem>
  //           </MenuList>
  //         </Menu>           <PageControls/>

  const clickHandler = (page, event) => {

    router.push(`/${page.type}/${page.id}`)
    //let local = element.getBoundingClientRect()
    console.log('check data', event.target)
  }
  

  return ( 
    <Box>
      <Tabs isManual variant="enclosed" >
        <TabList >
          {userPages.map((page) => {
            return  <Tab key={`${page.id}`} onClick={(event) => clickHandler(page, event)}>                 
              {page.title} 
              
            </Tab>
          })}

          <Tab onClick={() => router.push(`/availablePages`)}>                 
            +
          </Tab>

        </TabList>
      </Tabs>

      <PageControls/>
    </Box>
)}