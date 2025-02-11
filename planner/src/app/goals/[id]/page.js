//
// User will make set of goals to be checked off each day
//  db data in: [{
  // completion : [{date: '2024-11-12'},...]
  // fk_goal_pg : "f348abf8-6a35-4f4f-a275-bf4aab188f1d"
  // id : "27e6f92f-23bb-49e0-87ec-796568eaef0e"
  // title : "exercise"
// }, ...]
//  data internal: [{
  // completion : (31) [null, true,...]
  // id : "27e6f92f-23bb-49e0-87ec-796568eaef0e"
  // title : "exercise"
//
//..................................................................................
// notes/edits:
// check length of inputs. allow wrapping or sizing will be fd
// dates should not be "buttons". wanted continuity from other similar pages. must redesign later
// you can edit a title, of a filled goal. not useful. way around? when created have popup??
// move modale into component? ran into difficulties, we'll see
// drop down modal has awful sizing
// active date is running in a way that is saving cur as +1
// prevent duplicate completion posts. t/f status based on setting?
// better way to access multiple params in get??? useSearchParams()
//  change how saving items works. db response to pot should be newest version of data
// put data into structure on load, different from notes...
//rename userData => activeData
//to do

// bugs:
//  bug w modal, focus issue
//  not filtering month properly

"use client"

import styles from "@/app/page.module.css";
import { daysInMonth, getFirstDayOfMonth, getDaysInMonth } from "@/utils/dateUtils.js";
import {
  Box,
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
  Center,
  Tag,
  TagLabel,
  HStack
} from '@chakra-ui/react';
import { CheckIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { colorLegend } from '@/utils/mockData.js';
import { SubHeader } from '@/components/SubHeader';
import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { Suspense } from 'react';


export default function Goals() {

  const {id} = useParams();   //let pgID = 'f348abf8-6a35-4f4f-a275-bf4aab188f1d'

  const { onOpen, onClose, isOpen } = useDisclosure()
  // all user goals from given page id @ active date
  const [userData, setData] = useState([]);
  //change name, confusion? goalCopy??
  const [editInput, setEdit] = useState({});
  const date = new Date();
  const [activeDate, setActiveDate] = useState(date);
  const [status, setStatus] = useState({ id: null, color: null });


  useEffect(() => {
    getGoals()
  }, [activeDate.getMonth()]);

  const getGoals = async () => {

    try {
      const res = await fetch(`/api/goalsPages/${id}?activeDate=${activeDate}`,{
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        console.log('resp',response)
        
        let temp = [];
        for (let goal of response.goallist) {
          let completionArr = Array(getDaysInMonth(activeDate)).fill(null);
          for (let day of goal.completion) {
            let d = new Date(day.date);
            //not necessary if not saving unnecessary date, may remove later
            if (day.date) {
              completionArr[d.getDate()] = true;
            }
          }
          temp.push({'id': `${goal.id}`, 'title': `${goal.title}`, 'completion': completionArr})
        } 

        setData(temp);
        
        console.log("Yeai!",response.goallist)
      }else{
        console.log("Oops! Something is wrong.")
      }
    } catch (error) {
        console.log(error)
    }
  }

  const patchGoal = async () => {
    //use goal copy state. on click set state
    //set state and save data OR save data and force reload. time?
    //patch strips completion info. not necessary

    try {
      const res = await fetch(`/api/goals`,{
        method: 'PATCH',
        body: JSON.stringify({id: editInput.id, 'title': editInput.title}),
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        let userCopy = [...userData];
        userCopy.map(goal => {
          if (goal.id === editInput.id) { 
            goal.title = editInput.title
          }
        })
        setData(userCopy);

        console.log("Yeai!",response)
      }else{
        console.log("Oops! Something is wrong.")
      }
    } catch (error) {
        console.log(error)
    }
    //onClose on success? else error popup?. leave here for now
    onClose()
  }

  const postGoalCompletion = async (goal) => {
    let dateNoTime = new Date(activeDate.getFullYear(), activeDate.getMonth(), activeDate.getDate());

    try {
      const res = await fetch(`/api/goalCompletion`,{
        method: 'POST',
        body: JSON.stringify({id: goal.id, date: dateNoTime}),
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()

        let day = activeDate.getDate() - 1 ;
        let boolArr = [...goal.completion];
        boolArr[day] = true;
        let userCopy = [...userData];
        userCopy.map(g => {
          if (g.id === goal.id) { 
            g.completion = boolArr
          }
        })
    
        setData(userCopy);

        console.log("Yeai!",response)
      }else{
        console.log("Oops! Something is wrong.")
      }
    } catch (error) {
        console.log(error)
    }
  }

  //not hooked up to db
  const goalAdd = () => {
    let hold = Array(daysInMonth).fill(null);
    setData(
      [...userData, 
        {
          'title': "title",
          'completion' : hold
        }
      ]
    );
     true;
  }

  //not hooked up to db currently
  const goalDel = () => {
    setData(userData => {
      return userData.filter((item, i) => i !== editInput.index)
    })

    onClose()
  }

  const editModal = (goal) => {
    setEdit({...goal})
    onOpen()
  }

  const testFunc = () => {
    console.log('check data', userData)
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <SubHeader activeDate={activeDate} setActiveDate= {setActiveDate}/>

        GOALS
        <Suspense>
        <HStack>
          <Button onClick={goalAdd} height='20px'> + </Button>
          <Tag
            size='md'
            borderRadius='full'
            variant={status.id === 'delete' ? 'solid' : 'subtle'}
            colorScheme='red'
            onClick={() => {
              setStatus({ id: 'delete', color: null })
            }}
          >      <TagLabel>X</TagLabel>
          </Tag>
        </HStack>

        <SimpleGrid columns={2} spacing={5}>

          {userData.map((goal, i) => {
            return <Flex key={`${goal.title}, ${i}`} direction='column'>
              <Heading>
                {goal.title}
                <IconButton onClick={() => postGoalCompletion(goal)} icon={<CheckIcon />} isRound={true} size='xs' margin='5px'></IconButton>
                
                <IconButton onClick={() => editModal(goal)} icon={<EditIcon />} isRound={true} size='xs' margin='5px'></IconButton>
              </Heading>

              <SimpleGrid columns={7} spacing={1}>
    
                {[...Array(getFirstDayOfMonth(activeDate))].map(function (object, i) {
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
            </Flex>
          })}
        </SimpleGrid>

        <Modal
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Goal</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <Input id="userInput" onChange={(e) => setEdit({...editInput, title: e.target.value})} icon={<DeleteIcon />} placeholder={editInput.title} />
              </FormControl>
              <Spacer/>
              <Center margin='20px' >
                <Button onClick={() => patchGoal()} colorScheme='blue' mr={3}>
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
        </Suspense>
      </main>
      <footer className={styles.footer}>
        <Box position='fixed' bottom='1em' right='1em' >
          <Button onClick={() => {testFunc()}} colorScheme='green'> Test</Button>
        </Box>
      </footer>
    </div>
  );
}
