//page to give users detailed journal page options
//  present user w categories of pages, then subtypes w examples, when clicked start add process, using user input
//---------------------------------------------------
// notes: 
//    when page is clicked, should it take user to example page THEN add??? or just add
//  example images added, to be replaced later
// pages could be split into categories, then multiple pages of that ype given. BUT pages are so versatile, how to categorize them
// could pop out seperate page add components, each page will need different starter data???
// dont love naming 'available pages', rename
// api/${page.type}Pages will have to change ??? pathing is a concern when differnt types of page are added
//only first example of each subtype will work, other subtypes dont exist, placeholder only, do error handling
//should title addition be necessary, if not, hpw to handle elsewhere?? valid placeholders?
// update subheader update upon add.
"use client"

import styles from "../page.module.css";
import {   
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Image,
  Input, 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Spacer,
  useDisclosure,
  useToast, 
  Container
} from '@chakra-ui/react';
import { availablePages } from '@/utils/constants';
import React, { useState, Fragment } from "react";

export default function AllPages() {
  let user_id = '3958dc9e-712f-4377-85e9-fec4b6a6442a';
  const toast = useToast();
  const [activePage, setActivePage] = useState();
  const [activeCategory, setActiveCategory] = useState();
  const { onOpen: onAddPageOpen, onClose: onAddPageClose, isOpen: isAddPageOpen } = useDisclosure();
  const { onOpen: onCategoryOpen, onClose: onCategoryClose, isOpen: isCategoryOpen } = useDisclosure();
  const [inputTitle, setInputTitle] = useState('');
  const isError = inputTitle === '';
  // hold any extra form data to add to db?
  let data;

  const handleInputChange = (e) => setInputTitle(e.target.value);

  const addPage = async (newPage) => {
    //include data: to add extra level of info into db
    //rename pages in api-> page (only interacting w 1 page at a time)
    // page. type may not work for api pathing if multiple goal types exists.... specificity needed
    // subtype is supposed to be specific>? make sure

    try {
      const res = await fetch(`/api/${activePage.type}Pages`,{
        method: 'POST',
        body: JSON.stringify({user_id: user_id, title: inputTitle, data: data}),
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        console.log("Yeai! POST",response)
      }else{
        console.log("Oops! Something is wrong.")
      }
    } catch (error) {
        console.log(error)
    }
    onAddPageClose()
  }

  const pageTypeClick = (category) => {
    setActiveCategory(category)
    onCategoryOpen()
  }

  
  const addPageClick = (page) => {
    setActivePage(page)
    onAddPageOpen()
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>

        JOURNAL PAGES
        <SimpleGrid columns={2} spacing={4}>
          {availablePages.map((pageCategory, i) => {
            return <Flex key={`${i} + ${pageCategory.type}`} 
              direction={'column'} 
              align={'center'} 
              onClick={() => pageTypeClick(pageCategory)}> 
                {pageCategory.type}
                {pageCategory.img}
            </Flex>
          })}
        </SimpleGrid>

        <Modal
          isOpen={isCategoryOpen}
          onClose={onCategoryClose}
          size='full'
          scrollBehavior='inside'
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{activeCategory?.type.replace(/^./, char => char.toUpperCase()) || 'Loading'} Pages</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>

              <Grid       
                h="200px"
                templateRows="repeat(3, 1fr)"
                templateColumns="repeat(3, 1fr)"
                gap={4}>

                {activeCategory?.subTypes.map((subType) => {
                  return <Fragment key={`${subType.type}`} >
                    <GridItem rowSpan={1} colSpan={2}>
                      <Image src={subType.img}   onClick={() => { 
                          onCategoryClose()
                          addPageClick(subType)
                        }} 
                      />
                    </GridItem>
                    <GridItem rowSpan={1} colSpan={1}>
                      <Container>{subType.blurb}</Container>
                    </GridItem>
                  </Fragment>
                })}
              </Grid>

            </ModalBody>
            <ModalFooter>
            
            </ModalFooter>
          </ModalContent>`
        </Modal>

        <Modal
          onClose={onAddPageClose} 
          isOpen={isAddPageOpen}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{activePage?.type.replace(/^./, char => char.toUpperCase()) || 'Loading'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>

              <FormControl isInvalid={isError}>
                <FormLabel>Title</FormLabel>
                <Input type='text' value={inputTitle} onChange={handleInputChange} />
                {!isError ? (
                  <FormHelperText>
                    Enter the title you'd like to add to your journal page
                  </FormHelperText>
                ) : (
                  <FormErrorMessage>Title is required.</FormErrorMessage>
                )}
              </FormControl>
              <Spacer/>
              <Center margin='20px' >
                <Button onClick={() => addPage()} colorScheme='blue' mr={3}>
                  Add Page to Collection
                </Button>
              </Center>
            </ModalBody>
    
            <ModalFooter>
       
            </ModalFooter>
          </ModalContent>`
        </Modal>

      </main>
      <footer>
      </footer>
    </div>
  );
}
