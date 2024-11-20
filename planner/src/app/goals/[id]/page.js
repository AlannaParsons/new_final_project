//
//user will make set of goals to be checked off each day
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
// don't have modal on map. only 1 modal
// bugs:
//  bug w modal, focus issue
//  useeffect running twice, fix
//

"use client"

import Image from "next/image";
import styles from "../../page.module.css";
import { daysInMonth, firstDayOfMonth, getFirstDayOfMonth, getDaysInMonth } from "../../../utils/dateUtils.js";
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
import { colorLegend } from '../../../utils/mockData.js';
import { SubHeader } from '../../../components/SubHeader.js';
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Suspense } from 'react';


export default function Goals() {
  const router = useRouter();
  //const id = router;
  const params = useParams();
  
  const searchParams = useSearchParams();
 
  const search = searchParams.getAll('id')
  //const search = searchParams.get('id')
  console.log('pulled from url:', search, params)

  const { onOpen, onClose, isOpen } = useDisclosure()
  let id = 'f348abf8-6a35-4f4f-a275-bf4aab188f1d'
  const user = '3958dc9e-712f-4377-85e9-fec4b6a6442a'
  //hard coded goal page id, will be controlled by header nav???

  //data structure????
  //should only successful complettions save? probably. leave status property for clarity and error checking?
  // const goalData = [{'id': goalID, 'title':'exercise','completion' : [bool array, entry per date]}, 

  // all user goals from given page id @ active date
  const [userData, setData] = useState([]);
  //change name, confusion? goalCopy??
  const [editInput, setEdit] = useState({});
  const date = new Date();
  const [activeDate, setActiveDate] = useState(date);

  useEffect(() => {
    getGoals(user, activeDate)

  }, [activeDate.getMonth()]);

  const getGoals = async (userID, date) => {

    try {
      const res = await fetch(`/api/goalsPages/${id}?activeDate=${activeDate}`,{
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        //console.log('resp',response)
        
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

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <SubHeader activeDate={activeDate} setActiveDate= {setActiveDate}/>

        GOALS
        <Suspense>
        <Button onClick={goalAdd} height='20px'> + </Button>

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
