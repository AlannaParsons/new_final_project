//user will make set of goals to be checked off each day
//check length of inputs. allow wrapping or sizing will be fd
//dates should not be "buttons". wanted continuity from other similar pages. must redesign later
//you can edit a title, of a filled goal. not useful. way around? when created have popup??
//move modale into component? ran into difficulties, we'll see
"use client"

import Image from "next/image";
import styles from "../page.module.css";
import { daysInMonth, date, firstDayOfMonth } from "../utils/dateUtils";
import {
  Button,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Spacer,
  Center
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { colorLegend } from '../utils/mockData.js';
import React, { useState, useRef } from "react";


export default function Goals() {

  const { onOpen, onClose, isOpen, onSub } = useDisclosure()

  //data structure????
  const goalData = [{'title':'exercise','completion' : [true,false,true,false,null,true,false,true,false,null,true,false,true,false,null, 
                                                        true,false,true,false,null,true,false,true,false,null,true,false,true,false,null]}, 
                    {'title':'chores','completion' : [true,true,true,true,null,true,true,true,true,null,true,true,true,true,null, 
                                                      true,true,true,true,null,true,true,true,true,null,true,true,true,true,null]}, 
                    {'title':'reading','completion' : [false,false,false,true,null,false,false,false,true,null,false,false,false,true,null, 
                                                      false,false,false,true,null,false,false,false,true,null,false,false,false,true,null]}]
  //set local dtatee, currently faux data
  const [savedData, setData] = useState(goalData);
  const [editInput, setEdit] = useState({'title':'', 'index': null});

  const goalAdd = () => {
    let hold = Array(daysInMonth).fill(null);
    setData(
      [...savedData, 
        {
          'title':'goal',
          'completion' : hold
        }
      ]
    );
  }

  const goalDel = () => {
    setData(savedData => {
      return savedData.filter((item, i) => i !== editInput.index)
    })

    onClose()
  }

  const goalEdit = () => {
    let objArr = [...savedData];
    objArr[editInput.index].title = editInput.title;

    setData(objArr);
    onClose()
  }

  const goalComplete = (goal, index) => {
    let day = date.getDate() - 1 ;
    let boolArr = [...goal.completion];
    boolArr[day] = true;
    let objArr = [...savedData];
    objArr[index].completion = boolArr;

    setData(objArr);
  }

  const editModal = (goal, index,) => {
    setEdit({'title': goal.title, index})
    onOpen()
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>

        GOALS
        <Button onClick={goalAdd} height='20px'> + </Button>

        <SimpleGrid columns={2} spacing={5}>

          {savedData.map((goal, i) => {
            return <Flex key={`${goal.title}, ${i}`} direction='column'>
              <Heading >
              {goal.title}
              <IconButton onClick={() => goalComplete(goal, i)} icon={<CheckIcon />} isRound={true} size='xs' margin='5px'></IconButton>
              
              <IconButton onClick={() => editModal(goal, i)} icon={<EditIcon />} isRound={true} size='xs' margin='5px'></IconButton>
              
              </Heading>
              <SimpleGrid columns={7} spacing={1}>
              
                {[...Array(firstDayOfMonth)].map(function (object, i) {
                  return <Button key={i} size='xs' height='20px' />;
                })}

                {goal.completion.map((completed, i) => {
                  let index = i % colorLegend.length;
                  let colorSet = 'gray'; 
                  
                  if (completed) {
                    colorSet = colorLegend[index]
                  }
                  return <Button key={`${i} + ${goal.title} + ${completed}`} size='xs' height='20px' colorScheme={ colorSet } >{i + 1}</Button>
                })}
            </SimpleGrid>

            <Modal
              isOpen={isOpen}
              onClose={onClose}
            >
              <ModalOverlay />
            ` <ModalContent>
                <ModalHeader>Edit Goal</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl>
                    <Input id="userInput" onChange={(e) => setEdit({'title': e.target.value, 'index': editInput.index})} icon={<DeleteIcon />} placeholder={editInput.title} />
                  </FormControl>
                  <Spacer/>
                  <Center margin='20px' >
                    <Button onClick={() => goalEdit()} colorScheme='blue' mr={3}>
                      Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                  </Center>
        
                  
                </ModalBody>
        
                <ModalFooter>


                  <IconButton onClick={() => goalDel(goal, i)} icon={<DeleteIcon />} colorScheme='red' isRound={true} size='sm' margin='5px'></IconButton>
                </ModalFooter>
              </ModalContent>`
            </Modal>
            </Flex>
          })}
        </SimpleGrid>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
